<?php

/*
Plugin Name: Advanced Custom Fields: Chart
Plugin URI: https://github.com/AtlanticMediaStrategies/ams-acf-chart-field-type
Description: A plugin to insert charts into your acf templates
Version: 1.0.0
Author:  AMS Product
Author URI:  https://github.com/AtlanticMediaStrategies
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

// exit if accessed directly
if( ! defined( 'ABSPATH' ) ) exit;


// check if class already exists
if( !class_exists('acf_plugin_chart') ) :

class acf_plugin_chart {

	/*
	*  __construct
	*
	*  This function will setup the class functionality
	*
	*  @type	function
	*  @date	17/02/2016
	*  @since	1.0.0
	*
	*  @param	n/a
	*  @return	n/a
	*/

	function __construct() {

		// set text domain
		// https://codex.wordpress.org/Function_Reference/load_plugin_textdomain
		load_plugin_textdomain( 'acf-chart', false, plugin_basename( dirname( __FILE__ ) ) . '/lang' );

		// include field
		add_action('acf/include_field_types', 	array($this, 'include_field_types')); // v5
		add_action('acf/register_fields', 		array($this, 'include_field_types')); // v4

	}


	/*
	*  include_field_types
	*
	*  This function will include the field type class
	*
	*  @type	function
	*  @date	17/02/2016
	*  @since	1.0.0
	*
	*  @param	$version (int) major ACF version. Defaults to 4
	*  @return	n/a
	*/

	function include_field_types( $version = 4 ) {
		// include
		include_once('fields/acf-chart-v' . $version . '.php');
	}

}


// initialize
new acf_plugin_chart();


// class_exists check
endif;

?>
