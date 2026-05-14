<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'role',
        'company',
        'quote',
        'avatar',
        'avatar_url',
        'rating',
        'published',
        'sort_order',
    ];

    protected $casts = [
        'published' => 'boolean',
        'rating' => 'integer',
        'sort_order' => 'integer',
    ];
}
