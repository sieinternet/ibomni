
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (inquiryConsolidatedView == null) var inquiryConsolidatedView = {};
inquiryConsolidatedView._path = '/ib/dwr';
inquiryConsolidatedView.getLiabilityIdr = function(callback) {
  dwr.engine._execute(inquiryConsolidatedView._path, 'inquiryConsolidatedView', 'getLiabilityIdr', callback);
}
inquiryConsolidatedView.getLiabilityUsd = function(callback) {
  dwr.engine._execute(inquiryConsolidatedView._path, 'inquiryConsolidatedView', 'getLiabilityUsd', callback);
}
inquiryConsolidatedView.inquiry = function(callback) {
  dwr.engine._execute(inquiryConsolidatedView._path, 'inquiryConsolidatedView', 'inquiry', callback);
}
inquiryConsolidatedView.getAssetsIdr = function(callback) {
  dwr.engine._execute(inquiryConsolidatedView._path, 'inquiryConsolidatedView', 'getAssetsIdr', callback);
}
inquiryConsolidatedView.getAssetsUsd = function(callback) {
  dwr.engine._execute(inquiryConsolidatedView._path, 'inquiryConsolidatedView', 'getAssetsUsd', callback);
}
