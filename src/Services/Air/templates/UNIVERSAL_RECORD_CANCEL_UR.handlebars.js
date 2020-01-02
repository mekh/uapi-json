module.exports = uapiVersion => `
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
  xmlns:univ="http://www.travelport.com/schema/universal_${uapiVersion}"
  >
  <soapenv:Header/>
  <soapenv:Body>
    <univ:UniversalRecordCancelReq TargetBranch="{{TargetBranch}}"  UniversalRecordLocatorCode="{{LocatorCode}}" Version="0">
      <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
      {{#if emulatePcc}}
      <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
      {{/if}}
    </univ:UniversalRecordCancelReq>
  </soapenv:Body>
</soapenv:Envelope>
`;
