// Nashorn script uses to download paks from web
var VERSION_FILE = "D:\\Version.cfg"
var OUTPUT_PATH = "D:\\patches\\" // must have trailing slash
var VERSION_URL = "http://download2.nexon.net/Game/DragonNest/patch/PatchInfoServer.cfg"
var DOWNLOAD_URL = "http://download2.nexon.net/Game/DragonNest/patch/%1$08d/Patch%1$08d.pak"

// "import" necessary stuff
var JFile = Java.type("java.io.File")
var JFiles = Java.type("java.nio.file.Files")
var JString = Java.type("java.lang.String")
var JFileOutputStream = Java.type("java.io.FileOutputStream")
var JURL = Java.type("java.net.URL")
var JArray = Java.type("byte[]")
var JStandardCopyOption = Java.type("java.nio.file.StandardCopyOption")

// helper functions
var write = function(path, contents) {
    var out = new JFileOutputStream(path)
    out.write(contents)
    out.close()
}

var getVersion = function(version) {
    var re = /(\d+)/g
    var match = re.exec(version)
    return parseInt(match[1])
}


// get the current version
//var version = getVersion(new JString(JFiles.readAllBytes(new JFile(VERSION_FILE).toPath())))
var version = 500

// get server version
var serverVersionURL = new JURL(VERSION_URL)
var input = serverVersionURL.openStream()
var bytes = new JArray(8192)
var serverVersion = ""
var read
while ((read=input.read(bytes)) != -1) {
    serverVersion = serverVersion + (new JString(bytes, 0, read))
}
input.close()
serverVersion = getVersion(serverVersion)

if (version == serverVersion) {
    print("Client and server version is " + version)
    print("No need to update")
    exit()
} else if (version > serverVersion) {
    print(JString.format("ERROR: Client reports version %d, but Server reports version %d.", version, serverVersion))
    exit()
}

for (var i = version + 1; i <= serverVersion; i++) {
    var url = new JURL(JString.format(DOWNLOAD_URL, i.intValue()))
    var output = new JFile(OUTPUT_PATH, "Patch" + i + ".pak")
    input = url.openStream()
    JFiles.copy(input, output.toPath(), JStandardCopyOption.REPLACE_EXISTING);
    print("Downloaded " + url.toString() + " to " + output.getPath())
}

var output = new JFileOutputStream(VERSION_FILE)
output.write((new JString(serverVersion)).getBytes()))
output.close()
print("Updated " + VERSION_FILE + " to " + serverVersion)