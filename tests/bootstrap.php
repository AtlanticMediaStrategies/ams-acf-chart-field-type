<?php
/**
 * The bootstrap used by PHPUnit and Build
 */

( PHP_SAPI === 'cli' ) || die( 'Access Denied' );

global $wp_rewrite, $wpdb;

require_once( dirname( __FILE__ ) . '/../../../../wp-load.php' );
require_once( ABSPATH . 'wp-admin/includes/admin.php' );

wp_set_current_user( 1 );
?>
