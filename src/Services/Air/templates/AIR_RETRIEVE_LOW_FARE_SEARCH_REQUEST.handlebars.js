module.exports = uapiVersion => `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <air:RetrieveLowFareSearchReq
            AuthorizedBy="user" TraceId="{{requestId}}" TargetBranch="{{TargetBranch}}"
            ProviderCode="{{providerCode}}"
            SearchId="{{searchId}}"
            xmlns:air="http://www.travelport.com/schema/air_${uapiVersion}"
            xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
            >
            <com:BillingPointOfSaleInfo OriginApplication="uAPI"/>
        </air:RetrieveLowFareSearchReq>
    </soap:Body>
</soap:Envelope>
`;
