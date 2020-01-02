module.exports = uapiVersion => `
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  >
  <soap:Header/>
  <soap:Body>
    <univ:UniversalRecordImportReq
      AuthorizedBy="user" TraceId="{{requestId}}" TargetBranch="{{TargetBranch}}"
      ProviderCode="{{provider}}" ProviderLocatorCode="{{pnr}}"
      xmlns:univ="http://www.travelport.com/schema/universal_${uapiVersion}"
      xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
      >
      <com:BillingPointOfSaleInfo OriginApplication="uAPI" xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"/>
      {{#if emulatePcc}}
      <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
      {{/if}}
    </univ:UniversalRecordImportReq>
  </soap:Body>
</soap:Envelope>
`;
