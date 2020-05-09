<template>
  <div id="app">

<!-- accepted-file-types="image/jpeg, image/png" -->

    <file-pond
        name="filepond"
        ref="pond"
        label-idle='Drag & Drop your files or <span class="filepond--label-action"> Browse </span>'
        :allow-multiple="multiple"
        imagePreviewMaxFileSize="1MB"
        :imagePreviewHeight="imagePreviewHeight"
        :instantUpload="instantUpload"
        max-files="5"
        dropOnElement="false"
        allowFileTypeValidation="true"
        dropOnPage="false"
        :server="server"
        dropValidation="true"
 
        v-on:init="handleFilePondInit"       
        @processfile="updateFiles"
        :allowImageTransform="false"
        /> 

  </div>
</template>

<script>
const firebase = require('firebase/app');
require('firebase/storage');

// Import Vue FilePond
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export default {
  name: "multiple-file-uploads",
  components: {
    FilePond
  },
  props:['path','filename','instantUpload','multiple','imagePreviewHeight'],
  data: function() {
    return {
      myFiles: [],
      storelocation: '',
      downloadURL: '',
      server: {
        load: (source, load, error, progress, abort) => {
            // Should get a file object from the URL here
            // ...
//            console.log(source);            
//            console.log(headers);            
            // Should call the progress method to update the progress to 100% before calling load
            // (computable, loadedSize, totalSize)
            progress(true, 0, 1024);

            // Should call the load method with a file object when done
 //           load(source)

            // Should expose an abort method so the request can be cancelled
            return {
                abort: () => {
                    // Let FilePond know the request has been cancelled
                    abort();
                }
            };
        },
        process: (fieldName, file, metadata, load, error, progress, abort) => {
            var uuid = guid();
            var storelocation = this.path; 
//            var thumblocation = this.path + '/thumbnails/';

            if(this.path != null){storelocation = storelocation + '/';}

            var defiendfilename = this.filename;
            if(defiendfilename == '' || defiendfilename == null){defiendfilename = uuid;}

            storelocation = storelocation + defiendfilename + '.' + file.name.split('.').pop();
/*            
            thumblocation = thumblocation + defiendfilename + '_200x200.' + file.name.split('.').pop();

            if(file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png'){
                //this.storelocation = thumblocation;
                this.sendfilename(thumblocation);
            }else{
                //this.storelocation = storelocation;
                this.sendfilename(storelocation);
            }
*/            

            var storageRef = firebase.storage().ref();
            // Upload file and metadata to the object 'images/mountains.jpg'
            var uploadTask = storageRef.child(storelocation).put(file, metadata);    //UPLOAD LINE

            // Listen for state changes, errors, and completion of the upload.
            // or 'state_changed'
            uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//              var progressTimer = snapshot.bytesTransferred / snapshot.totalBytes * 100;
//              console.log("Upload is " + progressTimer + "% done");
              // Should call the progress method to update the progress to 100% before calling load
              // Setting computable to false switches the loading indicator to infinite mode
              progress(true, 1024, 1024);

              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log("Upload is paused");
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  //console.log("Upload is running");
                  break;
              }
            },
            function(error) {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case "storage/unauthorized":
                  // User doesn't have permission to access the object
                  break;
                case "storage/canceled":
                  // User canceled the upload
                  break;
                case "storage/unknown":
                  // Unknown error occurred, inspect error.serverResponse
                  break;
              }
            },
            function() {
              // Upload completed successfully, now we can get the download URL
            
              uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                load(downloadURL);

                return {
                  abort: () => {
                    // Let FilePond know the request has been cancelled
                    abort();
                  }
                };
              });
            
            }
          );
            
        }//END PROCESS
      }
    };
  },
  mounted(){
//    console.log(this.myFiles)
  },
  methods: {
    handleFilePondInit: function() {
      return true;
    },
    updateFiles(error, file) {
      if (error) return false;

        var value = file.serverId;
        //Get compressed image URL
        if(value.match(/\.(jpeg|jpg|gif|png)/) != null){
            value = value.substring(0, value.lastIndexOf(".")) + "_200x200" + value.substring(value.lastIndexOf("."));
        }
      this.myFiles.push(value);
      this.$emit("getFiles", this.myFiles);
    },
/*    
    sendfilename(val){
        //console.log('sending file from filepond',val );
        this.$emit("savedfile", val);
        

    }
*/    
  }
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() 
    /*+
    "-" +
    s4() +
    s4() +
    s4()*/
  );
}
</script>