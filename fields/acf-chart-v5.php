<?php
// exit if accessed directly
if( ! defined( 'ABSPATH' ) ) exit;

if(! class_exists('Routes')) {
	die('Router needed');
}

// check if class already exists
if( !class_exists('acf_field_chart') ) :


class acf_field_chart extends acf_field {

	/*
	*  __construct
	*
	*  This function will setup the field type data
	*
	*  @type	function
	*  @date	5/03/2014
	*  @since	5.0.0
	*
	*  @param	n/a
	*  @return	n/a
	*/

	function __construct() {

		/*
		*  name (string) Single word, no spaces. Underscores allowed
		*/

		$this->name = 'chart';


		/*
		*  label (string) Multiple words, can include spaces, visible when selecting a field type
		*/

		$this->label = __('Chart', 'acf-chart');


		/*
		*  category (string) basic | content | choice | relational | jquery | layout | visualization
		*/

		$this->category = 'Visualization';


		/*
		*  defaults (array) Array of default settings which are merged into the field object. These are used later in settings
		*/

		$this->defaults = array();

		/*
		*  l10n (array) Array of strings that are used in JavaScript. This allows JS strings to be translated in PHP and loaded via:
		*  var message = acf._e('chart', 'error');
		*/

		$this->l10n = array(
			'error'	=> __('Error! Please enter a higher value', 'acf-chart'),
		);

		$this::map_routes();

		// do not delete!
  	parent::__construct();

	}

	/**
	 *  Maps upstatement/router
	 */
	function map_routes() {
		Routes::map('/acf-chart/update/:id/:name', function($params) {
			$this::updateData($_POST, $params);
		});
		Routes::map('/acf-chart/:id/:name', function($params) {
			$this::readData($params);
		});

		Routes::map('/acf-chart/thumbnail/:id/:name', function($params) {
			$this::saveThumbnail($_POST, $params);
		});
	}

	/**
	 *  @param $post {array} $_POST array
	 *  @param $params {array} params passed to route (id, name)
	 *  Source: https://wordpress.org/support/topic/saving-base64-string-as-a-media-attachment
	 */
	function saveThumbnail($post, $params) {
		$upload_dir = wp_upload_dir();
		$upload_path = str_replace( '/', DIRECTORY_SEPARATOR, $upload_dir['path'] ) . DIRECTORY_SEPARATOR;
		$decoded = base64_decode( $post['base64']) ;
		$filename = $params['name'] . '.png';
		$hashed_filename  = md5( $filename . microtime() ) . '_' . $filename;

		$image_upload     = file_put_contents( $upload_path . $hashed_filename, $decoded );

		$file             = array();
		$file['error']    = '';
		$file['tmp_name'] = $upload_path . $hashed_filename;
		$file['name']     = $hashed_filename;
		$file['type']     = 'image/jpg';
		$file['size']     = filesize( $upload_path . $hashed_filename );

		$file_return = wp_handle_sideload( $file, array( 'test_form' => false ) );
		if(!$file_return) {
			die('ERROR');
		}
		update_post_meta($params['id'], 'thumbnail', $file_return['url']);
		die(json_encode($file_return));
	}

	/**
	 *  @param $params {array} param array
	 */
	function readData($params) {
		header('Content-Type: application/json');
		$data = get_post_meta($params['id'], $params['name']);
		die(json_encode(array_shift($data)));
	}

	/**
	 *  @param $post {array}  the $_POST php array
	 *  @param $params {array} route array
	 */
	function updateData($post, $params) {
		header('Content-Type: application/json');
		$res = update_post_meta($params['id'], $params['name'], $post['json']);
		if(!$res) {
			header('status: 500');
			die('Error');
		}
		die(json_encode($res));
	}


	/*
	*  render_field_settings()
	*
	*  Create extra settings for your field. These are visible when editing a field
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field (array) the $field being edited
	*  @return	n/a
	*/

	function render_field_settings( $field ) {

		/*
		*  acf_render_field_setting
		*
		*  This function will create a setting for your field. Simply pass the $field parameter and an array of field settings.
		*  The array of settings does not require a `value` or `prefix`; These settings are found from the $field array.
		*
		*  More than one setting can be added by copy/paste the above code.
		*  Please note that you must also have a matching $defaults value for the field name (font_size)
		*/

		acf_render_field_setting( $field, array(
			'label'			=> __('Chart','acf-chart'),
			'instructions'	=> __('Customize a graph','acf-chart'),
			'type'			=> 'array',
			'name'			=> 'chart',
			'prepend'		=> '',
		));

	}



	/*
	*  render_field()
	*
	*  Create the HTML interface for your field
	*
	*  @param	$field (array) the $field being rendered
	*
	*  @type	action
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$field (array) the $field being edited
	*  @return	n/a
	*/

	function render_field( $field ) {
		preg_match('/\[(\d)+\]/', $field['name'], $matches);
		if(!$matches) {
			echo '<div><p>Please click "update" to update a csv in this area.</p></div>';
			return;
		}
		$order = $matches[1];
		if($order != '0' && !$order) {
			return; // don't render
		}
		echo '<div id="app" class="acf-chart" data-name="modules_'.$order.'_chart"></div>';
	}


	/*
	*  input_admin_enqueue_scripts()
	*
	*  This action is called in the admin_enqueue_scripts action on the edit screen where your field is created.
	*  Use this action to add CSS + JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_enqueue_scripts)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	function input_admin_enqueue_scripts() {

		$dir = dirname(plugin_dir_url( __FILE__ ));

		// register & include JS
		wp_register_script( 'acf-input-chart', "{$dir}/assets/dist/bundle.js", '' , '', true);
		wp_enqueue_script('acf-input-chart');

		// wp_register_script( 'acf-input-chart', "http://local.allstate.com:8080/assets/dist/bundle.js", '' , '', true);
		// wp_enqueue_script('acf-input-chart');
	}


	/*
	*  input_admin_head()
	*
	*  This action is called in the admin_head action on the edit screen where your field is created.
	*  Use this action to add CSS and JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_head)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	/*

	function input_admin_head() {



	}

	*/


	/*
   	*  input_form_data()
   	*
   	*  This function is called once on the 'input' page between the head and footer
   	*  There are 2 situations where ACF did not load during the 'acf/input_admin_enqueue_scripts' and
   	*  'acf/input_admin_head' actions because ACF did not know it was going to be used. These situations are
   	*  seen on comments / user edit forms on the front end. This function will always be called, and includes
   	*  $args that related to the current screen such as $args['post_id']
   	*
   	*  @type	function
   	*  @date	6/03/2014
   	*  @since	5.0.0
   	*
   	*  @param	$args (array)
   	*  @return	n/a
   	*/

   	/*

   	function input_form_data( $args ) {



   	}

   	*/


	/*
	*  input_admin_footer()
	*
	*  This action is called in the admin_footer action on the edit screen where your field is created.
	*  Use this action to add CSS and JavaScript to assist your render_field() action.
	*
	*  @type	action (admin_footer)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	/*

	function input_admin_footer() {



	}

	*/


	/*
	*  field_group_admin_enqueue_scripts()
	*
	*  This action is called in the admin_enqueue_scripts action on the edit screen where your field is edited.
	*  Use this action to add CSS + JavaScript to assist your render_field_options() action.
	*
	*  @type	action (admin_enqueue_scripts)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	/*

	function field_group_admin_enqueue_scripts() {

	}

	*/


	/*
	*  field_group_admin_head()
	*
	*  This action is called in the admin_head action on the edit screen where your field is edited.
	*  Use this action to add CSS and JavaScript to assist your render_field_options() action.
	*
	*  @type	action (admin_head)
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	n/a
	*  @return	n/a
	*/

	/*

	function field_group_admin_head() {

	}

	*/

	/*
	*  load_value()
	*
	*  This filter is applied to the $value after it is loaded from the db
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value (mixed) the value found in the database
	*  @param	$post_id (mixed) the $post_id from which the value was loaded
	*  @param	$field (array) the field array holding all the field options
	*  @return	$value
	*/

	function load_value( $value, $post_id, $field ) {
		return '<div class="acf-chart" data-id="'. $post_id .'" data-name="'.$field['name'].'"></div>';
	}


	/*
	*  update_value()
	*
	*  This filter is applied to the $value before it is saved in the db
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value (mixed) the value found in the database
	*  @param	$post_id (mixed) the $post_id from which the value was loaded
	*  @param	$field (array) the field array holding all the field options
	*  @return	$value
	*/

	/*

	function update_value( $value, $post_id, $field ) {

		return $value;

	}

	*/


	/*
	*  format_value()
	*
	*  This filter is appied to the $value after it is loaded from the db and before it is returned to the template
	*
	*  @type	filter
	*  @since	3.6
	*  @date	23/01/13
	*
	*  @param	$value (mixed) the value which was loaded from the database
	*  @param	$post_id (mixed) the $post_id from which the value was loaded
	*  @param	$field (array) the field array holding all the field options
	*
	*  @return	$value (mixed) the modified value
	*/

	// function format_value( $value, $post_id, $field ) {

		// bail early if no value
		// if( empty($value) ) {
		//
		// 	return $value;
		//
		// }


		// apply setting
		// if( $field['font_size'] > 12 ) {

			// format the value
			// $value = 'something';

		// }


		// return
		// return $value;
	// }


	/*
	*  validate_value()
	*
	*  This filter is used to perform validation on the value prior to saving.
	*  All values are validated regardless of the field's required setting. This allows you to validate and return
	*  messages to the user if the value is not correct
	*
	*  @type	filter
	*  @date	11/02/2014
	*  @since	5.0.0
	*
	*  @param	$valid (boolean) validation status based on the value and the field's required setting
	*  @param	$value (mixed) the $_POST value
	*  @param	$field (array) the field array holding all the field options
	*  @param	$input (string) the corresponding input name for $_POST value
	*  @return	$valid
	*/

	/*

	function validate_value( $valid, $value, $field, $input ){

		// Basic usage
		if( $value < $field['custom_minimum_setting'] )
		{
			$valid = false;
		}


		// Advanced usage
		if( $value < $field['custom_minimum_setting'] )
		{
			$valid = __('The value is too little!','acf-chart'),
		}


		// return
		return $valid;

	}

	*/


	/*
	*  delete_value()
	*
	*  This action is fired after a value has been deleted from the db.
	*  Please note that saving a blank value is treated as an update, not a delete
	*
	*  @type	action
	*  @date	6/03/2014
	*  @since	5.0.0
	*
	*  @param	$post_id (mixed) the $post_id from which the value was deleted
	*  @param	$key (string) the $meta_key which the value was deleted
	*  @return	n/a
	*/
	function delete_value( $post_id, $key ) {
		delete_post_meta($post_id, $key);
	}


	/*
	*  load_field()
	*
	*  This filter is applied to the $field after it is loaded from the database
	*
	*  @type	filter
	*  @date	23/01/2013
	*  @since	3.6.0
	*
	*  @param	$field (array) the field array holding all the field options
	*  @return	$field
	*/

	// /*

	// function load_field( $field ) {
	// 	return $field;
	//
	// }

	// */


	/*
	*  update_field()
	*
	*  This filter is applied to the $field before it is saved to the database
	*
	*  @type	filter
	*  @date	23/01/2013
	*  @since	3.6.0
	*
	*  @param	$field (array) the field array holding all the field options
	*  @return	$field
	*/

	/*

	function update_field( $field ) {

		return $field;

	}

	*/


	/*
	*  delete_field()
	*
	*  This action is fired after a field is deleted from the database
	*
	*  @type	action
	*  @date	11/02/2014
	*  @since	5.0.0
	*
	*  @param	$field (array) the field array holding all the field options
	*  @return	n/a
	*/

	/*
	function delete_field( $field ) {
	}
	*/

}


// create initialize
new acf_field_chart();


// class_exists check
endif;

?>
