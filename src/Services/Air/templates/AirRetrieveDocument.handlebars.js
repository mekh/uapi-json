module.exports = uapiVersion => `
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:air="http://www.travelport.com/schema/air_${uapiVersion}"
  xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
  >
  <soap:Header/>
  <soap:Body>
    <air:AirRetrieveDocumentReq
            AuthorizedBy="user"
            TargetBranch="{{TargetBranch}}"
            RetrieveProviderReservationDetails="true"
            ReturnRestrictions="true"
            ReturnPricing="true" RetrieveMCO="false"
            ProviderCode="{{provider}}"
            {{#if uapi_ur_locator}}
                UniversalRecordLocatorCode="{{uapi_ur_locator}}"
            {{/if}}
            {{#if pnr}}
                ProviderLocatorCode="{{pnr}}"
            {{/if}}
    >
      <com:BillingPointOfSaleInfo OriginApplication="uAPI"/>
      {{#if emulatePcc}}
      <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
      {{/if}}
      {{#if reservationLocatorCode}}
      <air:AirReservationLocatorCode>{{reservationLocatorCode}}</air:AirReservationLocatorCode>
      {{else}}
      <com:TicketNumber>{{ticketNumber}}</com:TicketNumber>
      {{/if}}
    </air:AirRetrieveDocumentReq>
  </soap:Body>
</soap:Envelope>
`;
