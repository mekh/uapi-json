module.exports = uapiVersion => `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header/>
  <soap:Body>
    <air:AirTicketingReq AuthorizedBy="user" ReturnInfoOnFail="true" TargetBranch="{{TargetBranch}}"
      xmlns:air="http://www.travelport.com/schema/air_${uapiVersion}"
      xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
      >
      <com:BillingPointOfSaleInfo OriginApplication="uAPI"/>
      {{#if emulatePcc}}
      <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
      {{/if}}
      <air:AirReservationLocatorCode>{{ReservationLocator}}</air:AirReservationLocatorCode>
      {{#refs}}
      <air:AirPricingInfoRef Key="{{key}}"/>
      {{/refs}}
      <air:AirTicketingModifiers>
        {{#refs}}
          <air:AirPricingInfoRef Key="{{key}}"/>
        {{/refs}}
        {{#if commission}}
        <com:Commission Level="Fare"
          {{#if commission.percent}}
            Type="PercentBase" Percentage="{{commission.percent}}"
          {{else}}
            Type="Flat" Amount="{{commission.amount}}"
          {{/if}}
        />
        {{/if}}
        <com:FormOfPayment Type="{{fop.type}}">
        {{#equal fop.type 'Credit'}}
          <com:CreditCard {{#if creditCard.type}}Type="{{creditCard.type}}"{{/if}}
                          Number="{{creditCard.number}}"
                          ExpDate="{{creditCard.expDate}}"
                          Name="{{creditCard.name}}"
                          CVV="{{creditCard.cvv2}}">
          </com:CreditCard>
        {{/equal}}
        </com:FormOfPayment>
      </air:AirTicketingModifiers>
    </air:AirTicketingReq>
  </soap:Body>
</soap:Envelope>
`;
