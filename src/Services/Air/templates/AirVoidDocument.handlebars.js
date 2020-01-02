module.exports = uapiVersion => `
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:air="http://www.travelport.com/schema/air_${uapiVersion}"
  xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
  >
  <soapenv:Header/>
  <soapenv:Body>
    <air:AirVoidDocumentReq
      AuthorizedBy="user" TargetBranch="{{TargetBranch}}" RetrieveProviderReservationDetails="false"
      ShowETR="false" ProviderCode="{{provider}}" ProviderLocatorCode="{{pnr}}"
      >
      <com:BillingPointOfSaleInfo OriginApplication="uAPI"/>
      {{#if emulatePcc}}
      <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
      {{/if}}
      <air:VoidDocumentInfo DocumentNumber="{{ticketNumber}}" DocumentType="E-Ticket"/>
    </air:AirVoidDocumentReq>
  </soapenv:Body>
</soapenv:Envelope>
`;
