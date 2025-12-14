<?php
/*
Plugin Name: MasterStudy Blockchain Certificates
Description: Connects to the EGYROBO Blockchain API to issue and verify certificates on Base Sepolia.
Version: 3.1
Author: Omar Gamal
*/

// ---------------------------------------------------------
// 1. SETTINGS PAGE
// ---------------------------------------------------------
add_action("admin_menu", "mbc_register_settings_page");

function mbc_register_settings_page()
{
    add_options_page(
        "Blockchain Settings",
        "Blockchain Certs",
        "manage_options",
        "mbc-settings",
        "mbc_settings_page_html",
    );
}

function mbc_settings_page_html()
{
    if (!current_user_can("manage_options")) {
        return;
    }

    if (isset($_POST["mbc_vercel_url"])) {
        update_option(
            "mbc_vercel_url",
            esc_url_raw(trim($_POST["mbc_vercel_url"])),
        );
        echo '<div class="updated"><p>Settings Saved!</p></div>';
    }

    $url = get_option("mbc_vercel_url", "");
    ?>
    <div class="wrap">
        <h1>🎓 Blockchain Certificate Settings</h1>
        <form method="post" action="">
            <table class="form-table">
                <tr>
                    <th scope="row">API Endpoint URL</th>
                    <td>
                        <input type="text" name="mbc_vercel_url" value="<?php echo esc_attr(
                            $url,
                        ); ?>" class="regular-text" style="width: 100%; max-width: 600px;">
                        <p class="description">
                            Enter the full API URL for issuing certificates.<br>
                            <strong>Verified Working URL:</strong> <code>https://blockchain-handler-wordpress-plugin-h9toqp4l1.vercel.app/certificates/issue</code>
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// ---------------------------------------------------------
// 2. HELPER: The Core Signing Function
// ---------------------------------------------------------
function mbc_get_or_create_signature($user_id, $course_id)
{
    // 1. Check DB first to avoid re-issuing
    $existing_sig = get_user_meta(
        $user_id,
        "blockchain_signature_" . $course_id,
        true,
    );
    if (!empty($existing_sig)) {
        return (string) $existing_sig;
    }

    // 2. If missing, prepare for API call
    $api_url = get_option("mbc_vercel_url");
    if (empty($api_url)) {
        return "Error: API URL missing in settings";
    }

    $user_info = get_userdata($user_id);
    $course_title = get_the_title($course_id);

    // Get Instructor Name
    $post_object = get_post($course_id);
    $instructor_name = "EGYROBO Instructor";
    if ($post_object) {
        $author_id = $post_object->post_author;
        $author_info = get_userdata($author_id);
        if ($author_info) {
            $instructor_name = $author_info->display_name;
        }
    }

    if (!$user_info || !$course_title) {
        return "Error: Invalid User/Course Data";
    }

    // 3. Generate a Unique ID and HASH it to be compatible with bytes32
    $raw_id = "cert-" . $course_id . "-" . $user_id . "-" . uniqid();
    // Create a 0x-prefixed SHA256 hash (Exactly 66 chars: 0x + 64 hex)
    $signature_key = "0x" . hash("sha256", $raw_id);

    // 4. Prepare Body for the API
    $body = [
        "signature" => $signature_key,
        "studentName" => $user_info->display_name,
        "courseName" => $course_title,
        "instructorName" => $instructor_name,
    ];

    // 5. Call API
    $response = wp_remote_post($api_url, [
        "body" => json_encode($body),
        "headers" => ["Content-Type" => "application/json"],
        "timeout" => 30,
        "sslverify" => false,
    ]);

    if (is_wp_error($response)) {
        return "Connection Error: " . $response->get_error_message();
    }

    // 6. Handle API Response
    $body_json = json_decode(wp_remote_retrieve_body($response), true);

    if (isset($body_json["success"]) && $body_json["success"] === true) {
        // SUCCESS: Save the SIGNATURE KEY (not the tx hash) so we can verify it later
        update_user_meta(
            $user_id,
            "blockchain_signature_" . $course_id,
            $signature_key,
        );

        // Optional: You could save the tx hash in a separate meta field if you want to link to it
        // update_user_meta($user_id, 'blockchain_tx_hash_' . $course_id, $body_json['data']['transactionHash']);

        return $signature_key;
    } elseif (isset($body_json["error"])) {
        return "API Error: " . $body_json["error"];
    }

    return "Signing Failed: Unknown Response";
}

// ---------------------------------------------------------
// 3. TRIGGER 1: Course Completion (Background)
// ---------------------------------------------------------
add_action("stm_lms_course_completed", "mbc_trigger_on_completion", 10, 2);

function mbc_trigger_on_completion($user_id, $course_id)
{
    // Attempt to sign immediately upon completion
    mbc_get_or_create_signature($user_id, $course_id);
}

// ---------------------------------------------------------
// 4. BUILDER INTEGRATION (Drag & Drop Block)
// ---------------------------------------------------------
add_filter("stm_certificates_fields", "mbc_add_builder_field", 999);

function mbc_add_builder_field($fields)
{
    if (!is_array($fields)) {
        $fields = [];
    }

    $fields["blockchain_signature"] = [
        "id" => "blockchain_signature",
        "name" => "Blockchain Signature",
        "label" => "Blockchain Signature",
        "title" => "Blockchain Signature",
        "type" => "text",
        "category" => "student",
        "section" => "student",
        "value" => "0x7e8f0a... (Signature)",
    ];

    return $fields;
}

// ---------------------------------------------------------
// 5. TRIGGER 2: PDF Generation (Display Logic)
// ---------------------------------------------------------
add_filter(
    "masterstudy_lms_certificate_fields_data",
    "mbc_inject_real_data",
    10,
    2,
);

function mbc_inject_real_data($fields, $certificate = null)
{
    if (!is_array($fields)) {
        return $fields;
    }

    $user_id = get_current_user_id();
    $course_id = 0;

    // Robustly find Course ID from context
    if (isset($_GET["course_id"])) {
        $course_id = intval($_GET["course_id"]);
    } elseif (
        $certificate &&
        is_array($certificate) &&
        isset($certificate["course_id"])
    ) {
        $course_id = $certificate["course_id"];
    } elseif (
        $certificate &&
        is_object($certificate) &&
        isset($certificate->course_id)
    ) {
        $course_id = $certificate->course_id;
    }

    // Get the FULL signature (Generates it if missing!)
    $full_signature = "Signature ID Missing";
    if ($course_id > 0) {
        $full_signature = mbc_get_or_create_signature($user_id, $course_id);
    }

    // --- VISUAL FORMATTING ---
    // If it looks like a Transaction Hash (starts with 0x), truncate it nicely.
    // Example: 0x12345...abcde
    $display_text = $full_signature;

    if (strpos($full_signature, "0x") === 0 && strlen($full_signature) > 25) {
        $start = substr($full_signature, 0, 10);
        $end = substr($full_signature, -10);
        $display_text = $start . "..." . $end;
    }

    // Search and Update the field in the certificate data
    foreach ($fields as $key => $field) {
        $is_match = false;
        if (
            isset($field["name"]) &&
            $field["name"] === "blockchain_signature"
        ) {
            $is_match = true;
        }
        if (isset($field["id"]) && $field["id"] === "blockchain_signature") {
            $is_match = true;
        }
        if (
            isset($field["content"]) &&
            strpos($field["content"], "0x7e8f0a") !== false
        ) {
            $is_match = true;
        }

        if ($is_match) {
            $fields[$key]["content"] = $display_text;
            $fields[$key]["value"] = $display_text;
        }
    }

    return $fields;
}
