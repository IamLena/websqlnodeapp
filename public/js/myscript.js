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
