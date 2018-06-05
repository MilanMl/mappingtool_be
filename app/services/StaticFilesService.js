import axios from 'axios';
import convert from 'xml-js';
import ENV_CONFIG from '../../app/config/envConfig';
import application from '../../app/config/application';

export const StaticFilesService = (function() {
  let convertXmlToJson = function(xml) {
    xml = convert.xml2json(xml, { compact: true, spaces: 4 });
    return JSON.parse(xml);
  };

  let removeXmlTagsPart = function(xmlContent) {
    xmlContent = xmlContent.replace(/wsdl:/g, '');
    xmlContent = xmlContent.replace(/xsd:/g, '');
    xmlContent = xmlContent.replace(/wsp:/g, '');
    xmlContent = xmlContent.replace(/xmlns:/g, '');

    return xmlContent;
  };

  return {
    addStaticFile: async function(a) {
      return 666;
    },

    getStaticFile: async function(relativePath) {
      const path = application.getCurrentHost() + relativePath;
      console.log(path);
      try {
        let file = await axios.get(path);
        file = file.data;
        return file;
      } catch (e) {
        console.log(e.name + ' (' + e.kind + ') with value ' + e.value);
      }
    },

    getStaticFilePath: function(relativePath) {
      return Application.getCurrentHost() + relativePath;
    },

    convertXmlFileToJson: function(xml) {
      xml = removeXmlTagsPart(xml);
      const json = convertXmlToJson(xml);

      return json;
    }
  };
})();
