
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (sendToken == null) var sendToken = {};
sendToken._path = '/ib/dwr';
sendToken.generateToken = function(callback) {
  dwr.engine._execute(sendToken._path, 'sendToken', 'generateToken', callback);
}
