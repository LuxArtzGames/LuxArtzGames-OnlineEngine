///@func on_slope()
///@desc return the colliding slope instance or noone if none
function on_slope() {

	return collision_point(x, bbox_bottom + 1, objSlope, true, true)


}
