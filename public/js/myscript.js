const showdropdown = (id) => {
	if (document.getElementById(id).style.display == "block")
		document.getElementById(id).style.display = "none";
	else
		document.getElementById(id).style.display = "block";
}

const changefile = (id, value) => {
	if (value)
		document.getElementById(id).innerHTML = value;
	else
		document.getElementById(id).innerHTML = id;
}

const hello = (tifid) => {
	document.getElementById("input_tif_id").value = tifid;
}

const useorigin = (place_id, tif_id, lan_geo) => {
	document.setting_local_placeholder.place_id.value=place_id;
	document.setting_local_placeholder.tif_id.value=tif_id;
	document.setting_local_placeholder.lan_geo.value=lan_geo;
	document.getElementById('myform').submit();
}
