function generate() {
	DWRUtil.byId("loadingImage").style.display="block";
	sendToken.generateToken(function(data) {
    dwr.util.setValue("generate", data,{ escapeHtml:false });
    DWRUtil.byId("loadingImage").style.display="none";
  });
}