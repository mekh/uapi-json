module.exports = uapiVersion => `
<soapenv:Envelope 
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
  xmlns:univ="http://www.travelport.com/schema/universal_${uapiVersion}">
  <soapenv:Body>
    <univ:UniversalRecordRetrieveReq AuthorizedBy="user" TraceId="{{requestId}}" TargetBranch="{{TargetBranch}}">
    <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
    <univ:UniversalRecordLocatorCode>{{universalRecordLocatorCode}}</univ:UniversalRecordLocatorCode>
    
    {{#if emulatePcc}}
    <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
    {{/if}}
    </univ:UniversalRecordRetrieveReq>
  </soapenv:Body>
</soapenv:Envelope>
`;
