var Client = require('ssh2').Client;
var shell = require('shelljs');

var conn = new Client();
conn.on('ready', function() {
  console.log('Client :: ready');
  conn.shell(function(err, stream) {
    if (err) throw err;
    stream.on('close', function() {
      console.log('Stream :: close');
      copyBuild(conn);
      //conn.end();
    }).on('data', function(data) {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', function(data) {
      console.log('STDERR: ' + data);
    });
    stream.end('cd cavisson/src/netdiagnostics;   \nexit\n');
  });
}).connect({
  host: '10.10.40.4',
  port: 22,
  username: 'priyank',
  password: 'priyank'
  //privateKey: require('fs').readFileSync('/here/is/my/key')
});

var copyBuild = function(){
  
  conn.sftp(function(err, sftp) {
    if (err) throw err;
    /*sftp.fastGet('WORK/cavisson/export/builds/netdiagnostics..132.tar.gz', '.', {}, function(err){
       if (err) throw err;
       console.log("done");
       conn.end();
    })*/
   sftp.readdir('WORK/cavisson/export/builds', function(err, list) {
      if (err) throw err;

    var tarArr = list.filter(function(file){
      return ( file.filename.startsWith("netdiagnostics") && file.filename.endsWith("tar.gz") );
    })

    if(tarArr.length == 1)
    {
      var filename = tarArr[0].filename;
      console.log(tarArr[0].filename);
      sftp.fastGet('WORK/cavisson/export/builds/'+ filename, "c:/magic/"+filename, {}, function(err){
         if (err) throw err;
         console.log("done");
         conn.end();
        console.log(shell.ls());
      })
    }
    else
      conn.end();         
     
    });
  })
  
}