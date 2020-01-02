module.exports = uapiVersion => `
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:univ="http://www.travelport.com/schema/universal_${uapiVersion}"
  xmlns:gds="http://www.travelport.com/schema/gdsQueue_${uapiVersion}"
  xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
  >
  <soapenv:Header />
  <soapenv:Body>
    <gds:GdsQueuePlaceReq TargetBranch="{{TargetBranch}}" RetrieveProviderReservationDetails="true" PseudoCityCode="{{pcc}}" ProviderCode="{{provider}}" ProviderLocatorCode="{{pnr}}">
      <com:BillingPointOfSaleInfo OriginApplication="uAPI" xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"/>
      <com:QueueSelector Queue="{{queue}}" xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"/>
      {{#if emulatePcc}}
      <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
      {{/if}}
    </gds:GdsQueuePlaceReq>
  </soapenv:Body>
</soapenv:Envelope>
`;
