module.exports = uapiVersion => `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Header/>
    <soapenv:Body>
        <air:AirFareRulesReq
            TraceId="test" AuthorizedBy="{{requestId}}" TargetBranch="{{TargetBranch}}"
            RetrieveProviderReservationDetails="false" FareRuleType="long"
            xmlns:air="http://www.travelport.com/schema/air_${uapiVersion}"
            xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
            >
            <com:BillingPointOfSaleInfo OriginApplication="uAPI" xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"/>
            <air:FareRuleKey FareInfoRef="0" ProviderCode="{{provider}}">{{uapi_fare_rule_key}}</air:FareRuleKey>
            {{#each provider_cmds}}
            <air:AirFareDisplayRuleKey ProviderCode="{{provider}}">{{this}}</air:AirFareDisplayRuleKey>
            {{/each}}
            {{#if emulatePcc}}
            <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
            {{/if}}
        </air:AirFareRulesReq>
    </soapenv:Body>
</soapenv:Envelope>
`;
