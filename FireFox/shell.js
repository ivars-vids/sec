function shell(args){
	var filename;
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
	var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);

	if (!args){
		throw new Error('Missing argument');
	}
	if (!(args instanceof Array)){
		args = args.trim().replace(/ +/g,' ').split(' ');
	}

	filename = args.shift();
	file.initWithPath(filename);
	process.init(file);
	process.run(false, args, args.length);
}
