<?php
  global $wpdb;
  class ACF_Field_Test extends WP_UnitTestCase  {
    public function test_acf_class() {
      $this->assertTrue(class_exists('acf_field_chart'), 'class exists');
      $klass = new acf_field_chart();
      $this->assertEquals($klass->name, 'chart', 'Field name is chart');
      $post_id = $this->factory->post->create();
      echo print_r($post_id, TRUE);
      $this->assertGreaterThan(0, $post_id);
      $stuff = update_field('chart', '0,0,0', $post_id);
      $this->assertNotEmpty(get_field('chart', $post_id));
      $klass->delete_value($post_id, 'chart');
      // $this->assertNull(get_field('chart', $post_id));
    }
  }

  function tearDown() {
    parent::tearDown();
    echo "tear down the wall!";
  }
?>
