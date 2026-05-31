<?php
/**
 * IFLEON Theme Functions
 */

/**
 * Find the current Vite-built asset (e.g. assets/assets/index-<hash>.js).
 *
 * Vite generates a fresh content hash on every build, so hardcoding the
 * filename breaks the site after each rebuild. Instead we glob the build
 * directory for the entry file matching the given prefix/extension and
 * return its URL + filesystem path so we never have to touch this file again.
 *
 * @param string $prefix    Filename prefix without hash, e.g. 'index'.
 * @param string $extension File extension without the dot, e.g. 'js'.
 * @return array{url:string,path:string}|null
 */
function ifleon_find_asset($prefix, $extension) {
    $dir = get_template_directory() . '/assets/assets';
    $matches = glob($dir . '/' . $prefix . '-*.' . $extension);

    if (empty($matches)) {
        return null;
    }

    // If multiple stale builds linger, prefer the most recently modified.
    usort($matches, function ($a, $b) {
        return filemtime($b) - filemtime($a);
    });

    $file = $matches[0];

    return array(
        'url'  => get_template_directory_uri() . '/assets/assets/' . basename($file),
        'path' => $file,
    );
}

// Enqueue styles and scripts
function ifleon_enqueue_assets() {
    // Enqueue the theme stylesheet (style.css)
    wp_enqueue_style('ifleon-style', get_stylesheet_uri());

    // Enqueue the Vite-built app CSS (hash auto-detected)
    $css = ifleon_find_asset('index', 'css');
    if ($css) {
        wp_enqueue_style(
            'ifleon-app-css',
            $css['url'],
            array(),
            filemtime($css['path']) // cache-bust on every rebuild
        );
    }

    // Enqueue the Vite-built app JS (hash auto-detected)
    $js = ifleon_find_asset('index', 'js');
    if ($js) {
        wp_enqueue_script(
            'ifleon-main-js',
            $js['url'],
            array(),
            filemtime($js['path']), // cache-bust on every rebuild
            true
        );

        // Make the entry script load as an ES module
        add_filter('script_loader_tag', 'ifleon_add_module_to_script', 10, 3);
    }
}
add_action('wp_enqueue_scripts', 'ifleon_enqueue_assets');

// Add module attribute to the main JavaScript file
function ifleon_add_module_to_script($tag, $handle, $src) {
    if ('ifleon-main-js' === $handle) {
        $tag = '<script type="module" crossorigin src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}

// Output the favicon / app icon in <head> using the Vite-built logo asset.
// Hash auto-detected so it keeps working after every rebuild.
function ifleon_favicon() {
    $logo = ifleon_find_asset('logo', 'svg');
    if (!$logo) {
        return;
    }
    $url = esc_url($logo['url']);
    echo "\n";
    echo '<link rel="icon" href="' . $url . '" type="image/svg+xml" />' . "\n";
    echo '<link rel="shortcut icon" href="' . $url . '" type="image/svg+xml" />' . "\n";
    echo '<link rel="apple-touch-icon" href="' . $url . '" />' . "\n";
    echo '<meta name="theme-color" content="#0b1220" />' . "\n";
}
add_action('wp_head', 'ifleon_favicon');

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

