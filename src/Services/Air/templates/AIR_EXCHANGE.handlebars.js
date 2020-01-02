module.exports = uapiVersion => `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <air:AirExchangeReq
                xmlns:air="http://www.travelport.com/schema/air_${uapiVersion}"
                xmlns:common_${uapiVersion}="http://www.travelport.com/schema/common_${uapiVersion}"
                AuthorizedBy="user"
                ReturnReservation="false"
                TargetBranch="{{TargetBranch}}"
        >
            <com:BillingPointOfSaleInfo
                    xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
                    OriginApplication="UAPI"/>

            {{#if emulatePcc}}
                <com:OverridePCC ProviderCode="{{provider}}"
                                 xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
                                 PseudoCityCode="{{emulatePcc}}"
                />
            {{/if}}

            <air:AirReservationLocatorCode>{{uapi_reservation_locator}}</air:AirReservationLocatorCode>

            {{{xml.air:AirPricingSolution_XML}}}
            {{{xml.air:AirExchangeBundle_XML}}}
            {{{xml.common_${uapiVersion}:HostToken_XML}}}

            <com:FormOfPayment
                    xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
                    Type="Cash"
            />
        </air:AirExchangeReq>
    </soap:Body>
</soap:Envelope>
`;
