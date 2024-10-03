// noinspection JSUnusedGlobalSymbols

import {renderDate, renderLanguageOption, uniqueDeep} from "../utils";

export class DVV_person {
    constructor(ssn) {
        this.setData('ssn', ssn);

        const today = new Date();
        this.currentDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];
    }

    setData(path, value, asArray = false) {
        const keys = `data.${path}`.split('.');
        let current = this;
        keys.forEach((key, index) => {
            // Check if we're at the last key
            if (index === keys.length - 1) {
                if (asArray) {
                    // If asArray is true, handle the property as an array
                    if (!current[key] || !Array.isArray(current[key])) {
                        current[key] = [];
                    }
                    current[key].push(value);
                    current[key] = uniqueDeep(current[key])
                } else {
                    // If asArray is false, set the value directly
                    current[key] = value;
                }
            } else {
                // Navigate deeper into the object, creating new objects if necessary
                if (!current[key]) current[key] = {};
                current = current[key];
            }
        });
    }

    setAddress(type, {katunimi, katunumero, huoneistokirjain, huoneistonumero, postinumero, postitoimipaikka}) {
        this.setData(`addresses.${type}.street`, renderLanguageOption(katunimi));
        this.setData(`addresses.${type}.street_number`, katunumero ? parseInt(katunumero) : null);
        this.setData(`addresses.${type}.apartment_letter`, huoneistokirjain);
        this.setData(`addresses.${type}.apartment_number`, huoneistonumero ? parseInt(huoneistonumero) : null);
        this.setData(`addresses.${type}.zip_code`, postinumero);
        this.setData(`addresses.${type}.city`, renderLanguageOption(postitoimipaikka));
    }

    /*
     * ### PERSONENS UPPGIFTER ###
     * ### PERSONENS UPPGIFTER ###
     * ### PERSONENS UPPGIFTER ###
    */

    /*
     * Personens namn
     */
    HENKILON_NIMI({etunimi, sukunimi}) {
        this.setData('first_name', etunimi);
        this.setData('last_name', sukunimi);
    }

    /*
     * Personbeteckning korrigering
     */
    HENKILOTUNNUS_KORJAUS({edellisetHenkilotunnukset}) {
        edellisetHenkilotunnukset.forEach(ssn => this.setData('previous_ssns', ssn, true));
    }

    /*
     * Dödsdag
     */
    KUOLINPAIVA({kuollut, kuolipv}) {
        if (kuollut) {
            const deceased_date = renderDate(kuolipv);
            this.setData('deceased_date', deceased_date);
            this.setData('is_dead', deceased_date <= this.currentDate);
        }
    }

    /*
     * Födelsedag
     */
    SYNTYMAPAIVA({syntymapv}) {
        this.setData('date_of_birth', renderDate(syntymapv));
    }

    /*
     * Kön
     */
    SUKUPUOLI({sukupuoli}) {
        let gender = null;
        switch (sukupuoli) {
            case 'NAINEN':
                gender = 'F';
                break;
            case 'MIES':
                gender = 'M';
                break;
            case 'PUUTTUU':
                gender = null;
        }
        this.setData('gender', gender);
    }

    /*
     * Datum för dödförklaring
     */
    KUOLLEEKSIJULISTAMISPAIVA(t) {
    }

    /*
     * medborgarskap
     */
    KANSALAISUUS({henkilonKansalaisuudet}) {
        const citizenships = henkilonKansalaisuudet
            .filter(({voimassaolo}) => 'AKTIIVI' === voimassaolo)
            .map(({kansalaisuuskoodi}) => kansalaisuuskoodi);

        this.setData('citizenship', citizenships, true);
        this.setData('has_finish_citizenship', citizenships.includes(246));
    }

    /*
     * Namnändring
     */
    NIMENMUUTOS(t) {
    }

    /*
     * Namnändring omfattande
     */
    NIMENMUUTOS_LAAJA(t) {
    }

    /*
     * Civilstand
     */
    SIVIILISAATY({siviilisaaty}) {
        let civil_state = null;
        switch (siviilisaaty) {
            case "PUUTTUU":
                civil_state = "MISSING";
                break;

            case "EI_TIETOA":
                civil_state = "NOT_KNOWN";
                break;

            case "NAIMATON":
                civil_state = "UNMARRIED";
                break;

            case "AVIOLIITOSSA":
                civil_state = "MARRIED";
                break;

            case "ASUMUSEROSSA":
                civil_state = "SEPARATED";
                break;

            case "ERONNUT":
                civil_state = "DIVORCED";
                break;

            case "LESKI":
                civil_state = "WIDOWED";
                break;

            case "REKISTEROIDYSSA_PARISUHTEESSA":
                civil_state = "IN_REGISTERED_PARTY";
                break;

            case "ERONNUT_REKISTEROIDYSTA_PARISUHTEESTA":
                civil_state = "DIVORCED_FROM_REGISTERED_PARTY";
                break;

            case "LESKI_REKISTEROIDYN_PARISUHTEEN_JALKEEN":
                civil_state = "WIDOWED_IN_REGISTERED_PARTY";
                break;
        }
        this.setData('civil_state', civil_state);
    }

    /*
     * Födelsehemkommun
     */
    SYNTYMAKOTIKUNTA({kuntakoodi}) {
        this.setData('municipality_birth', kuntakoodi);
    }

    /*
     * Födelseort utomlands
     */
    ULKOMAINEN_SYNTYMAPAIKKA({valtiokoodi, ulkomainenSyntymapaikka}) {
        this.setData('foreign_birth_place', {
            'country': valtiokoodi,
            'city': ulkomainenSyntymapaikka || null
        });
    }

    /*
     * Modersmål
     */
    AIDINKIELI({kielikoodi}) {
        this.setData('mother_tongue', kielikoodi);
    }

    /*
     * ### FÖRBUD MOT UTLÄMNING AV PERSONUPPGIFTER ###
     * ### FÖRBUD MOT UTLÄMNING AV PERSONUPPGIFTER ###
     * ### FÖRBUD MOT UTLÄMNING AV PERSONUPPGIFTER ###
     */

    /*
     * Spärrmarkering
     */
    TURVAKIELTO({turvakieltoAktiivinen}) {
        this.setData('protected_identity', turvakieltoAktiivinen);
    }

    /*
     * Förbud mot uppdatering av kundregister
     */
    ASIAKASREKISTERIN_PAIVITYSKIELTO(t) {
    }

    /*
     * Förbud mot personmatriklar
     */
    HENKILOMATRIKKELIKIELTO(t) {
    }

    /*
     * Förbud mot släktforskning
     */
    SUKUTUTKIMUSKIELTO(t) {
    }

    /*
     * Förbud mot direktmarknadsföring
     */
    SUORAMARKKINOINTIKIELTO(t) {
    }

    /*
     * Förbud mot utlämnande av kontaktuppgifter
     */
    YHTEYSTIETOJEN_LUOVUTUSKIELTO(t) {
    }

    /*
     * ### ADRESSUPPGIFTER ###
     * ### ADRESSUPPGIFTER ###
     * ### ADRESSUPPGIFTER ###
     */

    /*
     * Stadigvarande adress i hemlandet
     */
    VAKINAINEN_KOTIMAINEN_OSOITE(t) {
        this.setAddress('permanent', t);
    }

    /*
     * stadigvarande adress i utlandet
     */
    VAKINAINEN_ULKOMAINEN_OSOITE({valtiokoodi, lahiosoite, paikkakunta}) {
        this.setData('address.permanent_abroad.country_code', valtiokoodi);
        this.setData('address.permanent_abroad.street', lahiosoite);
        this.setData('address.permanent_abroad.city', paikkakunta);
    }

    /*
     * Postadress i hemlandet
     */
    KOTIMAINEN_POSTIOSOITE(t) {
        this.setAddress('postal', t);
    }

    /*
     * Tillfällig adress i hemlandet
     */
    TILAPAINEN_KOTIMAINEN_OSOITE(t) {
        this.setAddress('temporary', t);
    }

    /*
     * Tillfällig adress i utlandet
     */
    TILAPAINEN_ULKOMAINEN_OSOITE(t) {
        this.setAddress('temporary_abroad', t);
    }

    /*
     * Postadress i utlandet
     */
    ULKOMAINEN_POSTIOSOITE({valtiokoodi, lahiosoite, paikkakunta}) {
        this.setData('address.postal_abroad.country_code', valtiokoodi);
        this.setData('address.postal_abroad.street', lahiosoite);
        this.setData('address.postal_abroad.city', paikkakunta);
    }

    /*
     * ### HEMVISTUPPGIFTER ###
     * ### HEMVISTUPPGIFTER ###
     * ### HEMVISTUPPGIFTER ###
     */

    /*
     * Hemkommun
     */
    KOTIKUNTA({kuntakoodi, kuntaanMuuttopv}) {
        this.setData('home_municipality.code', kuntakoodi);
        this.setData('home_municipality.moved_to', renderDate(kuntaanMuuttopv))
    }

    /*
     * Kommun vid årsskiftet
     */
    VUODENVAIHTEEN_KUNTA({kuntakoodi}) {
        this.setData('municipality_turn_year', kuntakoodi);
    }

    /*
     * Tidigare hemkommun
     */
    EDELLINEN_KOTIKUNTA({kuntakoodi, kuntaanMuuttopv, kunnastaPoisMuuttopv}) {
        this.setData('previous_municipalities', {
            municipality: kuntakoodi,
            moved_in: renderDate(kuntaanMuuttopv),
            moved_out: renderDate(kunnastaPoisMuuttopv)
        }, true);
    }

    /*
     * Tidigare hemortsbeteckning i hemlandet
     */
    EDELLINEN_KOTIMAINEN_ASUINPAIKKATUNNUS(t) {
    }

    /*
     * Tidigare boende på vistelseorten
     */
    ENTINEN_OLINPAIKASSA_ASUMINEN(t) {
    }

    /*
     * Tidigare boende i utlandet
     */
    ENTINEN_ULKOMAILLA_ASUMINEN(t) {
    }

    /*
     * Frånvaro
     */
    POISSAOLO(t) {
    }

    /*
     * Datum för inflyttning till Finland
     */
    SUOMEEN_MUUTTOPAIVA({suomeenMuuttopv}) {
        this.setData('moved_to_finland_date', renderDate(suomeenMuuttopv));
    }

    /*
     * Folkbokföringskommun
     */
    VAESTOKIRJANPITOKUNTA({kuntakoodi}) {
        this.setData('responsible_municipality', kuntakoodi);
    }

    /*
     * Land dit personen flyttat
     */
    VALTIO_JOHON_MUUTTANUT({valtiokoodi}) {
        this.setData('moved_to_country', valtiokoodi)
    }

    /*
     * Land varifrån personen flyttat
     */
    VALTIO_JOSTA_MUUTTANUT({valtiokoodi}) {
        this.setData('moved_from_country', valtiokoodi)
    }

    /*
     * Tidigare hemortsbeteckning i hemlandet
     */
    TILAPAINEN_KOTIMAINEN_ASUINPAIKKATUNNUS(t) {
    }

    /*
     * Tillfällig kommun
     */
    TILAPAINEN_KUNTA({kuntakoodi}) {
        this.setData('temporary_municipality', kuntakoodi);
    }

    /*
     * Tillfällig boende på vistelseorten
     */
    TILAPAINEN_OLINPAIKASSA_ASUMINEN({kuntakoodi, lajikoodi, numero, laitos, alkupv, loppupv, asuinpaikantunnus}) {
        this.setData('temporary_resident_location', {
            municipality: kuntakoodi,
            type: lajikoodi,
            number: numero,
            institute: laitos,
            moved_in: renderDate(alkupv),
            moved_out: renderDate(loppupv),
            address_code: asuinpaikantunnus || null
        });

    }

    /*
     *Tillfällig boende i utlandet
     */
    TILAPAINEN_ULKOMAILLA_ASUMINEN(t) {
    }

    /*
     * stadigvarande hemortsbeteckning i hemlandet
     */
    VAKINAINEN_KOTIMAINEN_ASUINPAIKKATUNNUS(t) {
    }

    /*
     * stadigvarande boende på vistelseorten
     */
    VAKINAINEN_OLINPAIKASSA_ASUMINEN(t) {
        this.setData('address_in_permanent_place', t);
    }

    /*
     * Stadigvarande boende i utlandet
     */
    VAKINAINEN_ULKOMAILLA_ASUMINEN(t) {
    }

    /*
     * ### Uppgifter av relationer mellan personer ###
     * ### Uppgifter av relationer mellan personer ###
     * ### Uppgifter av relationer mellan personer ###
     */

    /*
     * Hemskillnad, "separation"
     */
    ASUMUSERO(t) {
    }

    /*
     * Äktenskap
     */
    AVIOLIITTO({voimassaolo, vihkitapa, puoliso, vihkipv}) {
        if ('AKTIIVI' === voimassaolo) {

            let type;

            switch (vihkitapa) {
                case 'KIRKOLLINEN_VIHKIMINEN':
                    type = 'RELIGIOUS';
                    break;
                case 'SIVIILIVIHKIMINEN':
                    type = 'CIVIL';
                    break;
                case 'VIHKITAPA_EI_TIEDOSSA':
                    type = 'UNKNOWN';
                    break;
                case 'REKISTEROINTI':
                    type = 'REGISTERED';
                    break;
                case 'PARISUHDE_AVIOLIITOKSI':
                    type = 'RELATIONSHIP_TO_MARRIAGE';
                    break;
                case 'AVIOLIITTO_PARISUHTEEKSI':
                    type = 'MARRIAGE_INTO_COUPLE';
                    break;
                default:
                    type = 'OTHER';
            }

            this.setData('marriage', {
                partner: puoliso['henkilotunnus'],
                type,
                date: renderDate(vihkipv)
            });
        }
    }

    /*
     * Intressebevakning
     */
    EDUNVALVONTA(t) {
    }

    /*
     * Intressebevakningsfullmakt
     */
    EDUNVALVONTAVALTUUTUS(t) {
    }

    /*
     * Barn under vårdnad
     */
    HUOLLETTAVA(t) {
    }

    /*
     * Barn under vårdnad begränsad
     */
    HUOLLETTAVA_SUPPEA(t) {
    }

    /*
     * Vårdnadshavare
     */
    HUOLTAJA(t) {
    }

    /*
     * Vårdnadshavare begränsad
     */
    HUOLTAJA_SUPPEA({huoltaja}) {
        this.setData('custodian', huoltaja['henkilotunnus'], true);
    }

    /*
     * Omhändertagande
     */
    HUOSTAANOTTO(t) {
    }

    /*
     * Barn
     */
    LAPSI(t) {
    }

    /*
     * Barn, kort version
     */
    LAPSI_SUPPEA(t) {
    }

    /*
     * Familjerelation
     */
    PERHESUHDE(t) {
    }

    /*
     * Registrerat partnerskap
     */
    REKISTEROITY_PARISUHDE(t) {
    }

    /*
     * Förälder
     */
    VANHEMPI(t) {
    }

    /*
     * Förälder begränsad
     */
    VANHEMPI_SUPPEA({vanhempi}) {
        this.setData('parents', vanhempi['henkilotunnus'], true);
    }

    /*
     * ### Övriga uppgifter om personen ###
     * ### Övriga uppgifter om personen ###
     * ### Övriga uppgifter om personen ###
    */

    /*
     * Yrke
     */
    AMMATTI({ammatti}) {
        this.setData('profession', ammatti);
    }

    /*
     * Ärendehanteringsspråk
     */
    ASIOINTIKIELI({kielikoodi}) {
        this.setData('business_language', kielikoodi);
    }

    /*
     * Historia om trossamfund
     */
    HISTORIAA_USKONTOKUNNASTA(t) {
    }

    /*
     * Ordningsbokstav
     */
    JARJESTYSKIRJAIN(t) {
    }

    /*
     * Kontaktadress i hemlandet
     */
    KOTIMAINEN_YHTEYSOSOITE(t) {
        this.setAddress('address.secured_person', t);
    }

    /*
     * Tilltalsnamn
     */
    KUTSUMANIMI({nimi}) {
        this.setData('call_name', nimi);
    }

    /*
     * elektronisk kommunikationskod
     */
    SAHKOINEN_ASIOINTITUNNUS(t) {
    }

    /*
     * Utländsk personbeteckning
     */
    ULKOMAINEN_HENKILOTUNNUS({voimassaolo, valtiokoodi, ulkomainenHenkilotunnus}) {
        if ('AKTIIVI' === voimassaolo) {
            this.setData('foreign_ssns', {
                country: valtiokoodi,
                ssn: ulkomainenHenkilotunnus
            }, true);
        }
    }

    /*
     * kontaktadress i utlandet
     */
    ULKOMAINEN_YHTEYSOSOITE(t) {
    }

    /*
     * Trossamfund
     */
    USKONTOKUNTA(t) {
    }

    /*
     * Trossamfundsart
     */
    USKONTOKUNTALAJI({uskontokuntalaji}) {
        let religion = '';
        switch (uskontokuntalaji) {
            case 'EI_USKONTOKUNTAA':
                religion = 'NONE';
                break;

            case 'EV_LUT':
                religion = 'EV_LUT';
                break;

            case 'ORT':
                religion = 'ORTHODOX';
                break;

            case 'REK_USK': // rekisteröity uskonnollinen
                religion = 'REGISTERED_RELIGION';
                break;

            case 'SAKSALAINEN_SRK':
                religion = 'GERMAN_EV_LUT';
                break;

            case 'OLAUS_PETRI':
                religion = 'OLAUS_PETRI';
                break;
        }
        this.setData('religion', religion);
    }

    /*
     * E-postadress
     */
    SAHKOPOSTIOSOITE({sahkopostiosoite}) {
        this.setData('email', sahkopostiosoite);
    }
}
