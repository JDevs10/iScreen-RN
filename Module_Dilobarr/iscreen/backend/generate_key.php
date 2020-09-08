<?php
/**
* Generate a License Key.
* Optional Suffix can be an integer or valid IPv4, either of which is converted to Base36 equivalent
* If Suffix is neither Numeric or IPv4, the string itself is appended
*
* @param   string  $suffix Append this to generated Key.
* @return  string
*/
$num_segments = 5;
$segment_chars = 5;
$tokens = 'abcdefghijklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
$license_string = '';

// Build License String
for ($i = 0; $i < $num_segments; $i++) {
	$segment = '';
	for ($j = 0; $j < $segment_chars; $j++) {
		$segment .= $tokens[rand(0, strlen($tokens)-1)];
	}
	$license_string .= $segment;
	if ($i < ($num_segments - 1)) {
		$license_string .= '-';
	}
}
print $license_string;
?>