<?php
/**
 * IFLEON Theme Functions
 */

// Enqueue styles and scripts
function ifleon_enqueue_assets() {
    // Enqueue the main CSS file
    wp_enqueue_style('ifleon-style', get_stylesheet_uri());
    
    // Enqueue the Vue app CSS
    wp_enqueue_style(
        'ifleon-vue-css',
        get_template_directory_uri() . '/assets/assets/index-D8DMeEOo.css',
        array(),
        '1.0'
    );
    
    // Enqueue the JavaScript file
    wp_enqueue_script(
        'ifleon-main-js',
        get_template_directory_uri() . '/assets/assets/index-Do4X0UF9.js',
        array(),
        '1.0',
        true
    );
    
    // Make the script a module
    add_filter('script_loader_tag', 'ifleon_add_module_to_script', 10, 3);
}
add_action('wp_enqueue_scripts', 'ifleon_enqueue_assets');

// Add module attribute to the main JavaScript file
function ifleon_add_module_to_script($tag, $handle, $src) {
    if ('ifleon-main-js' === $handle) {
        $tag = '<script type="module" crossorigin src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}

// Theme setup
function ifleon_theme_setup() {
    // Add theme support for title tag
    add_theme_support('title-tag');
    
    // Add theme support for post thumbnails
    add_theme_support('post-thumbnails');
    
    // Add theme support for HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Add theme support for custom logo
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));
}
add_action('after_setup_theme', 'ifleon_theme_setup');

// Remove WordPress version from head
remove_action('wp_head', 'wp_generator');

// Clean up WordPress head
function ifleon_clean_head() {
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
}
add_action('init', 'ifleon_clean_head');

?>

