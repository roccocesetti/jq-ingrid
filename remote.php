<?php
// these are your constants
$rows = 25;
$cols = 4;

// these params are sent in the request from ingrid
$page = isset($_GET['page']) ? $_GET['page'] : 1;   // 
$sort = isset($_GET['sort']) ? $_GET['sort'] : '';  // column to sort by: 0-n
$dir  = isset($_GET['dir'])  ? $_GET['dir']  : '';  // sort direction: 'desc' or 'asc'

/*
here, you'd typically fire off your SQL statement to fetch
a result set, and render your HTML table containing rows below.
*/
?>
<table>
<tbody>
<?php 
for ($i=0; $i<$rows; $i++) {
	$uid = ($page-1)*$rows+$i;
?>
	<tr id="<?php echo $uid ?>">
	<?php
	for ($j=0; $j<$cols; $j++) {
		$sorted = ( $j == $sort ? ': sorted ' . $dir : '' );
		echo "<td>$uid : pg $page : row $i : col $j $sorted</td>";
	}
	?>
	</tr>
<?php
}
?>
</tbody>
</table>