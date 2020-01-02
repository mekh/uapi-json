module.exports = uapiVersion => `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        {{#if async}}
        <air:LowFareSearchAsynchReq
            AuthorizedBy="user" TraceId="{{requestId}}" TargetBranch="{{TargetBranch}}"
            ReturnUpsellFare="true"
            xmlns:air="http://www.travelport.com/schema/air_${uapiVersion}"
            xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
            >
        {{else}}
        <air:LowFareSearchReq
            AuthorizedBy="user" TraceId="{{requestId}}" TargetBranch="{{TargetBranch}}"
            ReturnUpsellFare="true"
            xmlns:air="http://www.travelport.com/schema/air_${uapiVersion}"
            xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"
            >
        {{/if}}
            <com:BillingPointOfSaleInfo OriginApplication="uAPI"/>
            {{#legs}}
            <air:SearchAirLeg>
                <air:SearchOrigin>
                    <com:CityOrAirport Code="{{from}}" {{#if preferAirportFrom}} PreferCity="false"{{else}} PreferCity="true" {{/if}}/>
                </air:SearchOrigin>
                <air:SearchDestination>
                    <com:CityOrAirport Code="{{to}}" {{#if preferAirportTo}} PreferCity="false"{{else}} PreferCity="true" {{/if}}/>
                </air:SearchDestination>
                <air:SearchDepTime PreferredTime="{{departureDate}}"/>
                <air:AirLegModifiers>
                    {{#*inline "connectionPoint"}}
                      <com:ConnectionPoint>
                        <com:CityOrAirport Code="{{connection}}" />
                      </com:ConnectionPoint>
                    {{/inline}}

                    {{#if ../permittedConnectionPoints}}
                    <air:PermittedConnectionPoints>
                    {{#each ../permittedConnectionPoints as |connection|}}
                      {{> connectionPoint connection=connection}}
                    {{/each}}
                    </air:PermittedConnectionPoints>
                    {{/if}}

                    {{#if ../prohibitedConnectionPoints}}
                    <air:ProhibitedConnectionPoints>
                    {{#each ../prohibitedConnectionPoints as |connection| }}
                      {{> connectionPoint connection=connection}}
                    {{/each}}
                    </air:ProhibitedConnectionPoints>
                    {{/if}}

                    {{#if ../preferredConnectionPoints}}
                    <air:PreferredConnectionPoints>
                    {{#each ../preferredConnectionPoints as |connection|}}
                      {{> connectionPoint connection=connection}}
                    {{/each}}
                    </air:PreferredConnectionPoints>
                    {{/if}}
                
                    {{#if ../cabins}}
                    <air:PreferredCabins>
                        {{#each ../cabins}}
                        <com:CabinClass Type="{{this}}"/>
                        {{/each}}
                    </air:PreferredCabins>
                    {{/if}}
                </air:AirLegModifiers>
            </air:SearchAirLeg>
            {{/legs}}
            <air:AirSearchModifiers
                {{#if maxJourneyTime}}
                    MaxJourneyTime="{{maxJourneyTime}}"
                {{/if}}
                {{#if maxSolutions}}
                    MaxSolutions="{{maxSolutions}}"
                {{/if}}
            >
                <air:PreferredProviders>
                    <com:Provider Code="{{provider}}" xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"/>
                </air:PreferredProviders>
                {{#if carriers}}
                <air:PermittedCarriers>
                    {{#carriers}}
                        <com:Carrier Code="{{.}}" xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"/>
                    {{/carriers}}
                </air:PermittedCarriers>
                {{/if}}
            </air:AirSearchModifiers>
            {{#passengers}}
            <com:SearchPassenger Code="{{ageCategory}}"{{#if isChild}} Age="{{age}}"{{/if}} xmlns:com="http://www.travelport.com/schema/common_${uapiVersion}"/>
            {{/passengers}}
            {{#if pricing}}
            <air:AirPricingModifiers
                {{#if pricing.currency}}
                CurrencyType="{{pricing.currency}}"
                {{/if}}

                {{#if pricing.eTicketability}}
                ETicketability="{{pricing.eTicketability}}"
                {{/if}}
            />
            {{/if}}
            {{#if emulatePcc}}
            <air:PCC>
                <com:OverridePCC ProviderCode="{{provider}}" PseudoCityCode="{{emulatePcc}}"/>
            </air:PCC>
            {{/if}}

        {{#if async}}
        </air:LowFareSearchAsynchReq>
        {{else}}
        </air:LowFareSearchReq>
        {{/if}}
    </soap:Body>
</soap:Envelope>
`;
