import EditorJS from "@editorjs/editorjs";
import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";

const preLoadedFields = window.__POST__EDITOR__preloadedFields;

console.log("preLoadedFields :", preLoadedFields);

const getPostBlock = (blockName) => {
  const postBlock = preLoadedFields.find((block) => block.name === blockName);
  if (!!postBlock) {
    return postBlock;
  }
  return null;
};

export const editorConfig = {
  /**
   * Id of Element that should contain Editor instance
   */
  holderId: "editorjs",

  /* Editor tools plugins */
  tools: {
    /*     code: {
      class: Code,
      inlineToolbar: true,
      placeholder: "Enter code here"
    }, */ // TODO: FIXME: Disabling code for the moment due to and editorjs bug
    checkList: {
      class: CheckList,
      inlineToolbar: true,
    },
    image: {
      class: ImageTool,
      inlineToolbar: true,
      config: {
        /*         endpoints: {
          byFile: "/admin/images/add" // Your backend file uploader endpoint
        } */
        uploader: {
          /**
           * Upload file to the server and return an uploaded image data
           * @param {File} file - file selected from the device or pasted by drag-n-drop
           * @return {Promise.<{success, file: {url}}>}
           */
          async uploadByFile(file) {
            // your own uploading logic here
            let formData = new FormData();

            formData.append("file", file);
            const uploadResponse = await fetch("/admin/images/add", {
              method: "post",
              body: formData,
            });
            const jsonResponse = await uploadResponse.json();
            return jsonResponse;
          },
        },
      },
    },
    delimiter: {
      class: Delimiter,
      inlineToolbar: true,
    },
    embed: {
      class: Embed,
      inlineToolbar: true,
    },
    header: {
      class: Header,
      inlineToolbar: true,
      placeholder: "Your heading",
    },
    inlineCode: {
      class: InlineCode,
      inlineToolbar: true,
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
  },
  data: preLoadedFields ? preLoadedFields : {},
};

export const createEditor = () => new EditorJS(editorConfig);
