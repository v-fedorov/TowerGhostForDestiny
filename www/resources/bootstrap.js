"use strict";function handleOpenURL(url){url&&url.indexOf&&url.indexOf("code")>-1&&(tgd.bungieCode=url.split("=")[1])}if(window.ua=navigator.userAgent,window.isNWJS="undefined"!=typeof require,window.isChrome=/Chrome/.test(ua)&&/Google Inc/.test(navigator.vendor)&&"undefined"!=typeof chrome,window.isFirefox=/firefox/i.test(ua),window.isIOS=/ios|iphone|ipod|ipad/i.test(ua),window.isiPad=/ipad/i.test(ua),window.isAndroid=/android/i.test(ua),window.isWindowsPhone=/iemobile/i.test(ua),window.isMobile=window.isIOS||window.isAndroid||window.isWindowsPhone,window.isKindle=/Kindle/i.test(ua)||/Silk/i.test(ua)||/KFTT/i.test(ua)||/KFOT/i.test(ua)||/KFJWA/i.test(ua)||/KFJWI/i.test(ua)||/KFSOWI/i.test(ua)||/KFTHWA/i.test(ua)||/KFTHWI/i.test(ua)||/KFAPWA/i.test(ua)||/KFAPWI/i.test(ua),window.isStaticBrowser=location.protocol.indexOf("http")>-1&&-1==location.href.indexOf("towerghostfordestiny.com/firefox"),window.isStaticBrowser&&(window.isMobile=window.isWindowsPhone=window.isAndroid=window.isIOS=window.isFirefox=window.isChrome=window.isNWJS=!1),"undefined"==typeof window.tgd&&(window.tgd={}),"undefined"==typeof tgd.dataDir&&(tgd.dataDir="data"),isWindowsPhone&&(window.requestFileSystem=function(){}),tgd.localLogging=location.href.indexOf("debug")>-1,tgd.localLog=function(msg){tgd.localLogging&&console.log(msg)},isFirefox){window.ffRequestId=0,window.ffXHRisReady=!1,window.addEventListener("cs-ready",function(event){window.ffXHRisReady=!0,tgd.dataDir=event.detail.localPath+"data"},!1);var ffXHR=function(){tgd.localLog("creating new ff obj");var self=this;return this.readyState=1,this.status=500,this.statusText="",this.request={},this.id=window.ffRequestId++,this.withCredentials=!0,this.processReply=function(event){var xhr=event.detail;xhr.id==self.id&&(tgd.localLog("xhr-reply! "+self.request.url),self.readyState=xhr.readyState,self.status=xhr.status,self.statusText=xhr.statusText,self.responseText=xhr.responseText,self.onreadystatechange(),window.removeEventListener("xhr-reply",self.processReply))},window.addEventListener("xhr-reply",self.processReply,!1),self};ffXHR.prototype={open:function(type,url,async,username,password){tgd.localLog("opening a new request"),this.request={id:this.id,type:type,url:url,async:async,username:username,password:password,headers:[]}},abort:function(){},setRequestHeader:function(key,value){this.request.headers.push({key:key,value:value})},getAllResponseHeaders:function(){return""},send:function(payload){var self=this,send=function(){payload&&(self.request.payload=payload);var event=new CustomEvent("xhr-request",{detail:self.request});window.dispatchEvent(event),tgd.localLog("send request to "+self.request.url)};if(1==window.ffXHRisReady)send();else var check=setInterval(function(){1==window.ffXHRisReady&&(clearInterval(check),send())},1e3)},onreadystatechange:function(){}},window.XMLHttpRequest=function(){return new ffXHR},tgd.localLog("init firefox xhr")}!function(exports){function MyFileError(obj){var code_=obj.code,name_=obj.name;Object.defineProperty(this,"code",{set:function(code){code_=code},get:function(){return code_}}),Object.defineProperty(this,"name",{set:function(name){name_=name},get:function(){return name_}})}function resolveToFullPath_(cwdFullPath,path){var fullPath=path,relativePath=path[0]!=DIR_SEPARATOR;relativePath&&(fullPath=cwdFullPath+DIR_SEPARATOR+path);for(var parts=fullPath.split(DIR_SEPARATOR),finalParts=[],i=0;i<parts.length;++i){var part=parts[i];if(".."===part){if(!finalParts.length)throw Error("Invalid path");finalParts.pop()}else"."===part||""!==part&&finalParts.push(part)}return fullPath=DIR_SEPARATOR+finalParts.join(DIR_SEPARATOR)}function MyFile(opts){var blob_=null;this.size=opts.size||0,this.name=opts.name||"",this.type=opts.type||"",this.lastModifiedDate=opts.lastModifiedDate||null,Object.defineProperty(this,"blob_",{enumerable:!0,get:function(){return blob_},set:function(val){blob_=val,this.size=blob_.size,this.name=blob_.name,this.type=blob_.type,this.lastModifiedDate=blob_.lastModifiedDate}.bind(this)})}function FileWriter(fileEntry){if(!fileEntry)throw Error("Expected fileEntry argument to write.");var position_=0,blob_=fileEntry.file_?fileEntry.file_.blob_:null;Object.defineProperty(this,"position",{get:function(){return position_}}),Object.defineProperty(this,"length",{get:function(){return blob_?blob_.size:0}}),this.seek=function(offset){position_=offset,position_>this.length&&(position_=this.length),0>position_&&(position_+=this.length),0>position_&&(position_=0)},this.truncate=function(size){blob_=blob_?size<this.length?blob_.slice(0,size):new Blob([blob_,new Uint8Array(size-this.length)],{type:blob_.type}):new Blob([]),position_=0,this.write(blob_)},this.write=function(data){if(!data)throw Error("Expected blob argument to write.");if(this.onwritestart&&this.onwritestart(),blob_){var head=blob_.slice(0,position_),tail=blob_.slice(position_+data.size),padding=position_-head.size;0>padding&&(padding=0),blob_=new Blob([head,new Uint8Array(padding),data,tail],{type:blob_.type})}else blob_=new Blob([data],{type:data.type});var writeFile=function(blob){fileEntry.file_.blob_=blob,fileEntry.file_.lastModifiedDate=data.lastModifiedDate||new Date,idb_.put(fileEntry,function(entry){support.blob||(fileEntry.file_.blob_=blob_,fileEntry.file_.lastModifiedDate=data.lastModifiedDate||null),position_+=data.size,this.onwriteend&&this.onwriteend()}.bind(this),this.onerror)}.bind(this);support.blob?writeFile(blob_):BlobToBase64(blob_,writeFile)}}function DirectoryReader(dirEntry){var dirEntry_=dirEntry,used_=!1;this.readEntries=function(successCallback,opt_errorCallback){if(!successCallback)throw Error("Expected successCallback argument.");used_?successCallback([]):idb_.getAllEntries(dirEntry_.fullPath,function(entries){used_=!0,successCallback(entries)},opt_errorCallback)}}function Metadata(modificationTime,size){this.modificationTime_=modificationTime||null,this.size_=size||0}function Entry(){}function FileEntry(opt_fileEntry){this.file_=null,Object.defineProperty(this,"isFile",{enumerable:!0,get:function(){return!0}}),Object.defineProperty(this,"isDirectory",{enumerable:!0,get:function(){return!1}}),opt_fileEntry&&(this.file_=opt_fileEntry.file_,this.name=opt_fileEntry.name,this.fullPath=opt_fileEntry.fullPath,this.filesystem=opt_fileEntry.filesystem,"string"==typeof this.file_.blob_&&(this.file_.blob_=Base64ToBlob(this.file_.blob_)))}function DirectoryEntry(opt_folderEntry){Object.defineProperty(this,"isFile",{enumerable:!0,get:function(){return!1}}),Object.defineProperty(this,"isDirectory",{enumerable:!0,get:function(){return!0}}),opt_folderEntry&&(this.name=opt_folderEntry.name,this.fullPath=opt_folderEntry.fullPath,this.filesystem=opt_folderEntry.filesystem)}function DOMFileSystem(type,size){storageType_=type==exports.TEMPORARY?"Temporary":"Persistent",this.name=(location.protocol+location.host).replace(/:/g,"_")+":"+storageType_,this.root=new DirectoryEntry,this.root.fullPath=DIR_SEPARATOR,this.root.filesystem=this,this.root.name=""}function requestFileSystem(type,size,successCallback,opt_errorCallback){return type!=exports.TEMPORARY&&type!=exports.PERSISTENT&&opt_errorCallback?void opt_errorCallback(INVALID_MODIFICATION_ERR):(fs_=new DOMFileSystem(type,size),void idb_.open(fs_.name,function(e){successCallback(fs_)},opt_errorCallback))}function resolveLocalFileSystemURL(url,successCallback,opt_errorCallback){var origin=location.protocol+"//"+location.host,base="filesystem:"+origin+DIR_SEPARATOR+storageType_.toLowerCase();url=url.replace(base,""),"/"===url.substr(-1)&&(url=url.slice(0,-1)),url?idb_.get(url,function(entry){if(entry){if(entry.isFile)return successCallback(new FileEntry(entry));if(entry.isDirectory)return successCallback(new DirectoryEntry(entry))}else opt_errorCallback&&opt_errorCallback(NOT_FOUND_ERR)},opt_errorCallback):successCallback(fs_.root)}function onError(e){switch(e.target.errorCode){case 12:console.log("Error - Attempt to open db with a lower version than the current one.");break;default:console.log("errorCode: "+e.target.errorCode)}console.log(e,e.code,e.message)}if(!exports.requestFileSystem&&!exports.webkitRequestFileSystem){var indexedDB=exports.indexedDB||exports.mozIndexedDB||exports.msIndexedDB;if(indexedDB){var support=new function(){var dbName="blob-support";indexedDB.deleteDatabase(dbName).onsuccess=function(){var request=indexedDB.open(dbName,1);request.onerror=function(){support.blob=!1},request.onsuccess=function(){var db=request.result;try{var blob=new Blob(["test"],{type:"text/plain"}),transaction=db.transaction("store","readwrite");transaction.objectStore("store").put(blob,"key"),support.blob=!0}catch(err){support.blob=!1}finally{db.close(),indexedDB.deleteDatabase(dbName)}},request.onupgradeneeded=function(){request.result.createObjectStore("store")}}},Base64ToBlob=function(dataURL){var BASE64_MARKER=";base64,";if(-1==dataURL.indexOf(BASE64_MARKER)){var parts=dataURL.split(","),contentType=parts[0].split(":")[1],raw=decodeURIComponent(parts[1]);return new Blob([raw],{type:contentType})}for(var parts=dataURL.split(BASE64_MARKER),contentType=parts[0].split(":")[1],raw=window.atob(parts[1]),rawLength=raw.length,uInt8Array=new Uint8Array(rawLength),i=0;rawLength>i;++i)uInt8Array[i]=raw.charCodeAt(i);return new Blob([uInt8Array],{type:contentType})},BlobToBase64=function(blob,onload){var reader=new FileReader;reader.readAsDataURL(blob),reader.onloadend=function(){onload(reader.result)}};exports.PERSISTENT||(exports.TEMPORARY=0,exports.PERSISTENT=1),void 0===exports.FileError&&(window.FileError=function(){},FileError.prototype.prototype=Error.prototype),FileError.INVALID_MODIFICATION_ERR||(FileError.INVALID_MODIFICATION_ERR=9,FileError.NOT_FOUND_ERR=1),MyFileError.prototype=FileError.prototype,MyFileError.prototype.toString=Error.prototype.toString;var INVALID_MODIFICATION_ERR=new MyFileError({code:FileError.INVALID_MODIFICATION_ERR,name:"INVALID_MODIFICATION_ERR"}),NOT_IMPLEMENTED_ERR=new MyFileError({code:1e3,name:"Not implemented"}),NOT_FOUND_ERR=new MyFileError({code:FileError.NOT_FOUND_ERR,name:"Not found"}),fs_=null,storageType_="temporary",idb_={};idb_.db=null;var FILE_STORE_="entries",DIR_SEPARATOR="/",DIR_OPEN_BOUND=String.fromCharCode(DIR_SEPARATOR.charCodeAt(0)+1);MyFile.prototype.constructor=MyFile,Metadata.prototype={get modificationTime(){return this.modificationTime_},get size(){return this.size_}},Entry.prototype={name:null,fullPath:null,filesystem:null,copyTo:function(){throw NOT_IMPLEMENTED_ERR},getMetadata:function(successCallback,opt_errorCallback){if(!successCallback)throw Error("Expected successCallback argument.");try{this.isFile?successCallback(new Metadata(this.file_.lastModifiedDate,this.file_.size)):opt_errorCallback(new MyFileError({code:1001,name:"getMetadata() not implemented for DirectoryEntry"}))}catch(e){opt_errorCallback&&opt_errorCallback(e)}},getParent:function(){throw NOT_IMPLEMENTED_ERR},moveTo:function(){throw NOT_IMPLEMENTED_ERR},remove:function(successCallback,opt_errorCallback){if(!successCallback)throw Error("Expected successCallback argument.");idb_["delete"](this.fullPath,function(){successCallback()},opt_errorCallback)},toURL:function(){var origin=location.protocol+"//"+location.host;return"filesystem:"+origin+DIR_SEPARATOR+storageType_.toLowerCase()+this.fullPath}},FileEntry.prototype=new Entry,FileEntry.prototype.constructor=FileEntry,FileEntry.prototype.createWriter=function(callback){callback(new FileWriter(this))},FileEntry.prototype.file=function(successCallback,opt_errorCallback){if(!successCallback)throw Error("Expected successCallback argument.");if(null==this.file_){if(!opt_errorCallback)throw NOT_FOUND_ERR;return void opt_errorCallback(NOT_FOUND_ERR)}var file=null==this.file_.blob_?this.file_:this.file_.blob_;file.lastModifiedDate=this.file_.lastModifiedDate,successCallback(file)},DirectoryEntry.prototype=new Entry,DirectoryEntry.prototype.constructor=DirectoryEntry,DirectoryEntry.prototype.createReader=function(){return new DirectoryReader(this)},DirectoryEntry.prototype.getDirectory=function(path,options,successCallback,opt_errorCallback){path=resolveToFullPath_(this.fullPath,path),idb_.get(path,function(folderEntry){if(options||(options={}),options.create===!0&&options.exclusive===!0&&folderEntry){if(opt_errorCallback)return void opt_errorCallback(INVALID_MODIFICATION_ERR)}else if(options.create!==!0||folderEntry)if(options.create===!0&&folderEntry){if(folderEntry.isDirectory)successCallback(new DirectoryEntry(folderEntry));else if(opt_errorCallback)return void opt_errorCallback(INVALID_MODIFICATION_ERR)}else if(options.create&&options.create!==!1||folderEntry){if(options.create&&options.create!==!1||!folderEntry||!folderEntry.isFile)successCallback(new DirectoryEntry(folderEntry));else if(opt_errorCallback)return void opt_errorCallback(INVALID_MODIFICATION_ERR)}else{if(path==DIR_SEPARATOR)return folderEntry=new DirectoryEntry,folderEntry.name="",folderEntry.fullPath=DIR_SEPARATOR,folderEntry.filesystem=fs_,void successCallback(folderEntry);if(opt_errorCallback)return void opt_errorCallback(NOT_FOUND_ERR)}else{var dirEntry=new DirectoryEntry;dirEntry.name=path.split(DIR_SEPARATOR).pop(),dirEntry.fullPath=path,dirEntry.filesystem=fs_,idb_.put(dirEntry,successCallback,opt_errorCallback)}},opt_errorCallback)},DirectoryEntry.prototype.getFile=function(path,options,successCallback,opt_errorCallback){path=resolveToFullPath_(this.fullPath,path),idb_.get(path,function(fileEntry){if(options||(options={}),options.create===!0&&options.exclusive===!0&&fileEntry){if(opt_errorCallback)return void opt_errorCallback(INVALID_MODIFICATION_ERR)}else if(options.create!==!0||fileEntry){if(options.create===!0&&fileEntry){if(fileEntry.isFile)successCallback(new FileEntry(fileEntry));else if(opt_errorCallback)return void opt_errorCallback(INVALID_MODIFICATION_ERR)}else if(options.create&&options.create!==!1||fileEntry){if(options.create&&options.create!==!1||!fileEntry||!fileEntry.isDirectory)successCallback(new FileEntry(fileEntry));else if(opt_errorCallback)return void opt_errorCallback(INVALID_MODIFICATION_ERR)}else if(opt_errorCallback)return void opt_errorCallback(NOT_FOUND_ERR)}else{var fileEntry=new FileEntry;fileEntry.name=path.split(DIR_SEPARATOR).pop(),fileEntry.fullPath=path,fileEntry.filesystem=fs_,fileEntry.file_=new MyFile({size:0,name:fileEntry.name,lastModifiedDate:new Date}),idb_.put(fileEntry,successCallback,opt_errorCallback)}},opt_errorCallback)},DirectoryEntry.prototype.removeRecursively=function(successCallback,opt_errorCallback){if(!successCallback)throw Error("Expected successCallback argument.");this.remove(successCallback,opt_errorCallback)},idb_.open=function(dbName,successCallback,opt_errorCallback){var self=this,request=indexedDB.open(dbName.replace(":","_"));request.onerror=opt_errorCallback||onError,request.onupgradeneeded=function(e){if(self.db=e.target.result,self.db.onerror=onError,!self.db.objectStoreNames.contains(FILE_STORE_)){self.db.createObjectStore(FILE_STORE_)}},request.onsuccess=function(e){self.db=e.target.result,self.db.onerror=onError,successCallback(e)},request.onblocked=opt_errorCallback||onError},idb_.close=function(){this.db.close(),this.db=null},idb_.drop=function(successCallback,opt_errorCallback){if(this.db){var dbName=this.db.name,request=indexedDB.deleteDatabase(dbName);request.onsuccess=function(e){successCallback(e)},request.onerror=opt_errorCallback||onError,idb_.close()}},idb_.get=function(fullPath,successCallback,opt_errorCallback){if(this.db){var tx=this.db.transaction([FILE_STORE_],"readonly"),range=IDBKeyRange.bound(fullPath,fullPath+DIR_OPEN_BOUND,!1,!0),request=tx.objectStore(FILE_STORE_).get(range);tx.onabort=opt_errorCallback||onError,tx.oncomplete=function(e){successCallback(request.result)}}},idb_.getAllEntries=function(fullPath,successCallback,opt_errorCallback){if(this.db){var results=[],range=null;fullPath!=DIR_SEPARATOR&&(range=IDBKeyRange.bound(fullPath+DIR_SEPARATOR,fullPath+DIR_OPEN_BOUND,!1,!0));var tx=this.db.transaction([FILE_STORE_],"readonly");tx.onabort=opt_errorCallback||onError,tx.oncomplete=function(e){results=results.filter(function(val){var valPartsLen=val.fullPath.split(DIR_SEPARATOR).length,fullPathPartsLen=fullPath.split(DIR_SEPARATOR).length;return fullPath==DIR_SEPARATOR&&fullPathPartsLen+1>valPartsLen?val:fullPath!=DIR_SEPARATOR&&valPartsLen==fullPathPartsLen+1?val:void 0}),successCallback(results)};var request=tx.objectStore(FILE_STORE_).openCursor(range);request.onsuccess=function(e){var cursor=e.target.result;if(cursor){var val=cursor.value;results.push(val.isFile?new FileEntry(val):new DirectoryEntry(val)),cursor["continue"]()}}}},idb_["delete"]=function(fullPath,successCallback,opt_errorCallback){if(this.db){var tx=this.db.transaction([FILE_STORE_],"readwrite");tx.oncomplete=successCallback,tx.onabort=opt_errorCallback||onError;var range=IDBKeyRange.bound(fullPath,fullPath+DIR_OPEN_BOUND,!1,!0);tx.objectStore(FILE_STORE_)["delete"](range)}},idb_.put=function(entry,successCallback,opt_errorCallback){if(this.db){var tx=this.db.transaction([FILE_STORE_],"readwrite");tx.onabort=opt_errorCallback||onError,tx.oncomplete=function(e){successCallback(entry)};tx.objectStore(FILE_STORE_).put(entry,entry.fullPath)}},exports.addEventListener("beforeunload",function(e){idb_.db&&idb_.db.close()},!1),exports.requestFileSystem=requestFileSystem,exports.resolveLocalFileSystemURL=resolveLocalFileSystemURL,exports===window&&exports.RUNNING_TESTS&&(exports.Entry=Entry,exports.FileEntry=FileEntry,exports.DirectoryEntry=DirectoryEntry,exports.resolveToFullPath_=resolveToFullPath_,exports.Metadata=Metadata,exports.Base64ToBlob=Base64ToBlob)}}}(self),function(){function loadManifest(manifest,fromLocalStorage,timeout){function finishLoadingFromFS(){if(index++,index==loading.length){var el=document.createElement("style");el.type="text/css",el.innerHTML=cssContent,head.appendChild(el);var el=document.createElement("script");el.type="text/javascript",console.log("appending script"),el.innerHTML=scriptsContent,head.appendChild(el)}}function loadNextFromFS(index){if(loading.length-1>=index){var element=loading[index][0],source=loading[index][1];window.__fs.root.getFile(source,{},function(fileEntry){fileEntry.file(function(file){var reader=new FileReader;reader.onloadend=function(){index++,loadNextFromFS(index),"text/javascript"==element.type?scriptsContent=scriptsContent+"\n"+this.result.toString():cssContent=cssContent+"\n"+this.result.toString(),finishLoadingFromFS()},reader.readAsText(file)})},function(){})}}function loadScripts(){scripts.forEach(function(src){src&&("/"===src[0]&&(src=src.substr(1)),src=loadAsScript?manifest.root+src:"app/"+src,src.substr(-5).indexOf(".js")>-1?(el=document.createElement("script"),el.type="text/javascript",el.async=!1,el.defer=!0,loadAsScript?el.src=src:loading.push([el,src])):(el=document.createElement(loadAsScript?"link":"style"),el.rel="stylesheet",loadAsScript?el.href=src:loading.push([el,src]),el.type="text/css"),head.appendChild(el))}),loadAsScript||loadNextFromFS(count)}if(fromLocalStorage&&setTimeout(function(){window.BOOTSTRAP_OK||(console.warn("BOOTSTRAP_OK !== true; Resetting to original manifest.json..."),localStorage.removeItem("manifest"),location.reload())},timeout),!manifest.load)return void console.error("Manifest has nothing to load (manifest.load is empty).",manifest);manifest.root=manifest.root||"./";var el,loadAsScript=1==isFirefox&&"./"==manifest.root||!isFirefox,head=document.getElementsByTagName("head")[0],scripts=manifest.load.concat(),loading=(Date.now(),[]),count=0,index=0,scriptsContent="",cssContent="";manifest.root.length>0&&"/"!==manifest.root[manifest.root.length-1]&&(manifest.root+="/"),fromLocalStorage||localStorage.setItem("manifest",JSON.stringify(manifest)),"undefined"!=typeof window.cordova?document.addEventListener("deviceready",loadScripts,!1):loadAsScript?loadScripts():window.requestFileSystem(1,20971520,function(fs){window.__fs=fs,loadScripts()},function(){}),window.Manifest=manifest}window.pegasus=function(a,xhr){return xhr=new XMLHttpRequest,xhr.open("GET",a),a=[],xhr.onreadystatechange=xhr.then=function(onSuccess,onError,cb){if(onSuccess&&onSuccess.call&&(a=[onSuccess,onError]),4==xhr.readyState&&(cb=a[0|xhr.status/400])){var response;try{response=JSON.parse(xhr.responseText)}catch(e){console.log(e)}var result=200!==xhr.status&&0!==xhr.status||""===xhr.responseText?xhr:response;cb(result)}},xhr.send(),xhr},window.Manifest={};var manifest=JSON.parse(localStorage.getItem("manifest")),s=document.querySelector("script[manifest]");if(!manifest||manifest&&manifest.root&&"./"==manifest.root){var noQueryString=location.href.indexOf("?")>-1?location.href.split("?")[0]:location.href,url=noQueryString.replace(noQueryString.split("/")[noQueryString.split("/").length-1],"")+((s?s.getAttribute("manifest"):null)||"bootstrap.json")+"?now="+(new Date).getTime();pegasus(url).then(loadManifest,function(xhr){console.error("Could not download "+url+": "+xhr.status)})}else loadManifest(manifest,!0,s.getAttribute("timeout")||1e4)}();
//# sourceMappingURL=bootstrap.js.map