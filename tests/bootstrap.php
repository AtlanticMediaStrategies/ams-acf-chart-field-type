<?php
/**
 * The bootstrap used by PHPUnit and Build
 */

( PHP_SAPI === 'cli' ) || die( 'Access Denied' );

global $wp_rewrite, $wpdb;

require_once( dirname( __FILE__ ) . '/../../../../wp-load.php' );
require_once( ABSPATH . 'wp-admin/includes/admin.php' );

function require_chart_field() {
  require_once dirname(dirname(__FILE)) . '/fields/acf-chart-v5.php';
}

add_filter('muplugins_loaded', 'require_chart_field');

wp_set_current_user( 1 );
?>
