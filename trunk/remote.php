<?php
$rows = 25;
$cols = 4;
$page = isset($_GET['page'])?$_GET['page']:1;
$sort = isset($_GET['sort'])?$_GET['sort']:-1;
?>
<table>
<tbody>
<?php for ($i=0; $i<$rows; $i++):
	$uid = ($page-1)*$rows+$i;
	?>
	<tr id="<?php echo $uid ?>">
	<?php
	for ($j=0; $j<$cols; $j++) {
		$sorted = $j==$sort?':sorted!':'';
		echo "<td>$uid : p{$page}:r$i:c$j:$sorted</td>";
	}
	?>
	</tr>
<?php endfor; ?>
</tbody>
</table>