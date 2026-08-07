<?php
error_reporting(0);
ini_set('display_errors', 0);

$host = "sql210.infinityfree.com";
$user = "if0_41173797";
$pass = "Zahir01911rasel";
$db   = "if0_41173797_donation";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ══════════════════════════════════════════════════════
//  AUTO-MIGRATION — missing columns fix হয় automatically
// ══════════════════════════════════════════════════════

// 1. admins.role — login এর জন্য দরকার
$r = $conn->query("SHOW COLUMNS FROM admins LIKE 'role'");
if ($r && $r->num_rows === 0) {
    $conn->query("ALTER TABLE admins ADD COLUMN `role` ENUM('admin','user') NOT NULL DEFAULT 'admin'");
    $conn->query("UPDATE admins SET `role` = 'admin'");
}

// 2. sbfc_saving — entry_id (rename from id if needed)
$r2 = $conn->query("SHOW COLUMNS FROM sbfc_saving LIKE 'entry_id'");
if ($r2 && $r2->num_rows === 0) {
    // Table has 'id' column — rename to entry_id
    $conn->query("ALTER TABLE sbfc_saving CHANGE `id` `entry_id` INT NOT NULL AUTO_INCREMENT");
}

// 3. sbfc_saving — remark (rename from note if needed)
$r3 = $conn->query("SHOW COLUMNS FROM sbfc_saving LIKE 'remark'");
if ($r3 && $r3->num_rows === 0) {
    $r3b = $conn->query("SHOW COLUMNS FROM sbfc_saving LIKE 'note'");
    if ($r3b && $r3b->num_rows > 0) {
        $conn->query("ALTER TABLE sbfc_saving CHANGE `note` `remark` TEXT");
    } else {
        $conn->query("ALTER TABLE sbfc_saving ADD COLUMN `remark` TEXT");
    }
}

// 4. sbfc_members.id_image
$r4 = $conn->query("SHOW COLUMNS FROM sbfc_members LIKE 'id_image'");
if ($r4 && $r4->num_rows === 0) {
    $conn->query("ALTER TABLE sbfc_members ADD COLUMN `id_image` VARCHAR(255) DEFAULT NULL");
}

// 5. donations.tr_id
$r5 = $conn->query("SHOW COLUMNS FROM donations LIKE 'tr_id'");
if ($r5 && $r5->num_rows === 0) {
    $conn->query("ALTER TABLE donations ADD COLUMN `tr_id` VARCHAR(100) UNIQUE");
}
?>