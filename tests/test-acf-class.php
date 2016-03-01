<?php
  global $wpdb;
  class ACF_Field_Test extends PHPUnit_Framework_TestCase {
    public function test_acf_class() {
      $klass = new acf_field_chart();
      $this->assertEquals($klass->name, 'chart');
    }
  }
?>
