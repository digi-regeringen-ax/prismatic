// noinspection JSUnusedGlobalSymbols

import {renderDate, renderLanguageOption, uniqueDeep} from "./utils";

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

    setAddress(type, t) {
        this.setData(`addresses.${type}.street`, renderLanguageOption(t.katunimi));
        this.setData(`addresses.${type}.street_number`, t.katunumero ? parseInt(t.katunumero) : null);
        this.setData(`addresses.${type}.apartment_letter_letter`, t.huoneistokirjain);
        this.setData(`addresses.${type}.apartment_number`, t.huoneistonumero ? parseInt(t.huoneistonumero) : null);
        this.setData(`addresses.${type}.zip_code`, t.postinumero);
        this.setData(`addresses.${type}.city`, renderLanguageOption(t.postitoimipaikka));
    }

    /**
     * Sets the gender based on the provided gender code.
     * @param {object} t - The object containing gender information.
     */
    SUKUPUOLI(t) {
        let gender = null;
        switch (t.sukupuoli) {
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

    /**
     * Sets the first and last name from the provided data object.
     * @param {object} t - The object containing name information.
     */
    HENKILON_NIMI(t) {
        this.setData('first_name', t.etunimi);
        this.setData('last_name', t.sukunimi);
    }

    /**
     * Sets the current call name if the name type is 'current'.
     * @param {object} t - The object containing name information.
     */
    NIMENMUUTOS(t) {
        if ('NYKYINEN_KUTSUMANIMI' === t.nimilaji) {
            this.setData('first_name_in_use', t.nimi);
        }
    }

    /**
     * Calls the NIMENMUUTOS method to handle the current name.
     * @param {object} t - The object containing name information.
     */
    NIMENMUUTOS_LAAJA(t) {
        this.NIMENMUUTOS(t);
    }

    /**
     * Calls the NIMENMUUTOS method to handle the current name.
     * @param {object} t - The object containing name information.
     */
    KUTSUMANIMI(t) {
        this.NIMENMUUTOS(t);
    }

    /**
     * Sets the municipality of birth using the municipality code.
     * @param {object} t - The object containing municipality information.
     */
    SYNTYMAKOTIKUNTA(t) {
        this.setData('municipality_birth', t.kuntakoodi);
    }

    /**
     * Sets the civil state based on the provided state code.
     * @param {object} t - The object containing civil state information.
     */
    SIVIILISAATY(t) {
        let civil_state = null;
        switch (t.siviilisaaty) {
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

    /**
     * Sets the date of birth by rendering the provided birth date.
     * @param {object} t - The object containing birth date information.
     */
    SYNTYMAPAIVA(t) {
        this.setData('date_of_birth', renderDate(t.syntymapv));
    }

    /**
     * Sets the temporary home address based on the provided data object.
     * @param {object} t - The object containing address information.
     */
    TILAPAINEN_KOTIMAINEN_OSOITE(t) { /* tillfällig inhemsk adress, prio 2 */
        this.setAddress('temporary', t);
        // TODO: check slut-datum.
        // ändringsattribut, kolla om det är nytt, ändrat, mm.
    }

    /**
     * Sets the postal address based on the provided data object.
     * @param {object} t - The object containing postal address information.
     */
    KOTIMAINEN_POSTIOSOITE(t) { /* Postadress, inhemsk, prio 1 */
        this.setAddress('postal', t);
    }

    /**
     * Sets the permanent home address based on the provided data object.
     * @param {object} t - The object containing permanent address information.
     */
    VAKINAINEN_KOTIMAINEN_OSOITE(t) { /* Stadigvarande, inhemsk adress, bostadsadress, prio 4 */
        this.setAddress('permanent', t);
    }

    /**
     * Sets the temporary municipality code based on the provided data object.
     * @param {object} t - The object containing municipality information.
     */
    TILAPAINEN_KUNTA(t) {
        this.setData('temporary_municipality', t.kuntakoodi);
    }

    /**
     * Sets the home municipality code and the date moved to that municipality.
     * @param {object} t - The object containing municipality information.
     */
    KOTIKUNTA(t) {
        this.setData('home_municipality.code', t.kuntakoodi);
        this.setData('home_municipality.moved_to', renderDate(t.kuntaanMuuttopv))
    }

    /**
     * Sets the business language code based on the provided data object.
     * @param {object} t - The object containing language information.
     */
    ASIOINTIKIELI(t) {
        this.setData('business_language', t.kielikoodi);
    }

    /**
     * Sets the deceased date if the person is marked as deceased.
     * @param {object} t - The object containing death information.
     */
    KUOLINPAIVA(t) { // Dödsdag
        if (t.kuollut) {
            this.setData('deceased_date', renderDate(t.kuolipv));
            this.setData('is_dead', this.data.deceased_date <= this.currentDate);
        }
    }

    /**
     * Sets the mother tongue language code based on the provided data object.
     * @param {object} t - The object containing language information.
     */
    AIDINKIELI(t) {
        this.setData('mother_tongue', t.kielikoodi);
    }

    /**
     * Sets the citizenship codes based on active citizenship records.
     * @param {object} t - The object containing citizenship information.
     */
    KANSALAISUUS(t) {
        this.setData('citizenship', t.henkilonKansalaisuudet
            .filter(c => 'AKTIIVI' === c.voimassaolo)
            .map(c => c.kansalaisuuskoodi));
    }

    /**
     * Sets the municipality code for the year of transition.
     * @param {object} t - The object containing municipality information.
     */
    VUODENVAIHTEEN_KUNTA(t) {
        this.setData('municipality_turn_year', t.kuntakoodi);
    }

    /**
     * Sets the religion based on the provided religious affiliation code.
     * @param {object} t - The object containing religion information.
     */
    USKONTOKUNTALAJI(t) { // trosamfundsart

        let religion = '';
        switch (t.uskontokuntalaji) {
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

    /**
     * Sets the previous religions based on historical records.
     * @param {object} t - The object containing religion history information.
     */
    HISTORIAA_USKONTOKUNNASTA(t) { // historia om trosamfund
        this.setData('previous_religions', {
            code: t.uskontokunta, start: renderDate(t.alkupv), stop: renderDate(t.loppupv)
        }, true);
    }

    /**
     * Calls the HISTORIAA_USKONTOKUNNASTA method for additional processing.
     * @param {object} t - The object containing religion information.
     */
    USKONTOKUNTA(t) { // Trosamfund. TODO: check if this one is the same as the above.
        this.HISTORIAA_USKONTOKUNNASTA(t);
    }

    /**
     * Ignores the child information as it's registered through 'LAPSI_SUPPEA'.
     * @param {object} t - The object containing child information.
     */
    LAPSI(t) {
        // ignore, as registered through 'LAPSI_SUPPEA'
    }

    /**
     * Sets the children's identifiers based on the provided data object.
     * @param {object} t - The object containing children information.
     */
    LAPSI_SUPPEA(t) { // children, short form
        this.setData('children', t.lapsi.henkilotunnus, true);
    }

    /**
     * Sets the previous SSNs based on the provided data object.
     * @param {object} t - The object containing previous SSNs.
     */
    HENKILOTUNNUS_KORJAUS(t) { // previous SSN's
        t.edellisetHenkilotunnukset.forEach(ssn => this.setData('previous_ssns', ssn, true));
    }

    /**
     * Sets the date when the person moved to Finland.
     * @param {object} t - The object containing move date information.
     */
    SUOMEEN_MUUTTOPAIVA(t) {
        this.setData('moved_to_finland_date', renderDate(t.suomeenMuuttopv));
    }

    /**
     * Sets family relationships if the status is active.
     * @param {object} t - The object containing family relationship information.
     */
    PERHESUHDE(t) {
        if ('AKTIIVI' === t.voimassaolo) {
            this.setData('family_relationships', t, true); // TODO: check what's up with these fields
        }
    }

    /**
     * Ignores the provided data for ordering character.
     * @param {object} t - The object containing ordering information.
     */
    JARJESTYSKIRJAIN(t) { // ordningsbokstav
    }

    /**
     * Sets the previous municipalities based on the provided data object.
     * @param {object} t - The object containing previous municipality information.
     */
    EDELLINEN_KOTIKUNTA(t) {
        this.setData('previous_municipalities', {
            municipality: t.kuntakoodi,
            moved_in: renderDate(t.kuntaanMuuttopv),
            moved_out: renderDate(t.kunnastaPoisMuuttopv)
        }, true);
    }

    /**
     * Ignores the information regarding previous residence.
     * @param {object} t - The object containing residence information.
     */
    ENTINEN_OLINPAIKASSA_ASUMINEN(t) {
        // TODO: check if this is previous addresses or rather EDELLINEN_KOTIMAINEN_ASUINPAIKKATUNNUS
    }

    /**
     * Sets the temporary residence location based on the provided data object.
     * @param {object} t - The object containing residence information.
     */
    TILAPAINEN_OLINPAIKASSA_ASUMINEN(t) {
        this.setData('temporary_resident_location', {
            municipality: t.kuntakoodi,
            type: t.lajikoodi,
            number: t.numero,
            institute: t.laitos,
            moved_in: renderDate(t.alkupv),
            moved_out: renderDate(t.loppupv),
            address_code: t.asuinpaikantunnus || null
        });
    }

    /**
     * Sets previous addresses based on the provided data object.
     * @param {object} t - The object containing address information.
     */
    EDELLINEN_KOTIMAINEN_ASUINPAIKKATUNNUS(t) {
        this.setData('previous_addresses', {
            municipality: t.kuntakoodi,
            moved_in: renderDate(t.alkupv),
            moved_out: renderDate(t.loppupv),
            address_code: t.asuinpaikantunnus || null
        }, true);

    }

    /**
     * Sets the email address based on the provided data object.
     * @param {object} t - The object containing email information.
     */
    SAHKOPOSTIOSOITE(t) {
        this.setData('email', t.sahkopostiosoite);
    }

    /**
     * Sets the information regarding residence in permanent place.
     * @param {object} t - The object containing residence information.
     */
    VAKINAINEN_OLINPAIKASSA_ASUMINEN(t) {
        this.setData('adress_in_permanent_place', t); // TODO: check what's up with these fields
    }

    /**
     * Sets the marriage details based on the provided data object if active.
     * @param {object} t - The object containing marriage information.
     */
    AVIOLIITTO(t) {
        if ('AKTIIVI' === t.voimassaolo) {

            let type;

            switch (t.vihkitapa) {
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
                    type = ''; // TODO: Give translation
                    break;
                case 'AVIOLIITTO_PARISUHTEEKSI':
                    type = '';// TODO: Give translation
                    break;
                default:
                    type = 'OTHER';
            }

            this.setData('marriage', {
                partner: t.puoliso.henkilotunnus, type, date: renderDate(t.vihkipv)
            });
        }
    }

    /**
     * Ignores additional details regarding migration from spouse.
     * @param {object} t - The object containing spouse information.
     */
    MAASTAMUUTON_LISATIEDOT_PUOLISOSTA(t) {
    }

    /**
     * Ignores additional details regarding migration from parents.
     * @param {object} t - The object containing parent information.
     */
    MAASTAMUUTON_LISATIEDOT_VANHEMMASTA(t) {
    }

    /**
     * Ignores additional details regarding migration from guardians.
     * @param {object} t - The object containing guardian information.
     */
    MAASTAMUUTON_LISATIEDOT_HUOLTAJASTA(t) {
    }


    LAPSEN_REKISTEROINNIN_LISATIEDOT(t) {
    }

    VIITEHENKILO(t) {
    }

    VIITEHENKILON_EDELLINEN_NIMI(t) {
    }

    VIITEHENKILON_EDELLISET_HENKILOTUNNUKSET(t) {
    }

    VAKINAINEN_KOTIMAINEN_ASUINPAIKKATUNNUS(t) {
    }

    VAKINAINEN_ULKOMAINEN_OSOITE(t) { /* foreign permanent (complete) adress */
        this.setData('address.permanent_abroad.country_code', t.valtiokoodi);
        this.setData('address.permanent_abroad.street', t.lahiosoite);
        this.setData('address.permanent_abroad.city', t.paikkakunta);
    }

    VAKINAINEN_ULKOMAILLA_ASUMINEN(t) { /* foreign permanent adress code */
    }

    TILAPAINEN_KOTIMAINEN_ASUINPAIKKATUNNUS(t) {
    }


    SUKUTUTKIMUSKIELTO(t) { // förbud för släktforskning
    }

    ULKOMAALAINEN_JOKA_ON_POISTETTU_VAESTOREKISTERISTA(t) {
    }

    VALTIO_JOHON_MUUTTANUT(t) {
        this.setData('moved_to_state', t.valtiokoodi)
    }

    SUORAMARKKINOINTIKIELTO(t) {
    }

    POISSAOLO(t) {
    }

    VAESTOKIRJANPITOKUNTA(t) {
        this.setData('responsible_municipality', t.kuntakoodi);
    }

    EDUNVALVONTA(t) { // intressebevakning
        this.setData('cared_of_by', {
            start: renderDate(t.alkupv), end: renderDate(t.paatymispv)
        });

        t.nykyisetEdunvalvojat.forEach(carer => {
            this.setData('cared_of_by.ssns', carer.edunvalvoja?.henkilotunnus, true)
        });
    }

    ULKOMAINEN_SYNTYMAPAIKKA(t) {
        this.setData('foreign_birth_place', {
            'country': t.valtiokoodi, 'city': t.ulkomainenSyntymapaikka || null
        });
    }

    VALTIO_JOSTA_MUUTTANUT(t) {
        this.setData('moved_from_country', t.valtiokoodi);
    }

    ENTINEN_ULKOMAILLA_ASUMINEN(t) {
        this.setData('address_in_foreign_country', {
            country: t.valtiokoodi,
            address: t.asuinpaikantunnus,
            start: renderDate(t.alkupv),
            end: renderDate(t.loppupv)
        }, true);
    }

    ULKOMAINEN_HENKILOTUNNUS(t) {
        if ('AKTIIVI' === t.voimassaolo) {
            this.setData('foreign_ssns', {
                country: t.valtiokoodi, ssn: t.ulkomainenHenkilotunnus
            }, true);
        }
    }

    REKISTERIVIRANOMAINEN(t) {
        this.setData('registry_authority', 777 === t.viranomaisnumero ? 'FINLAND' : 'ÅLAND');
    }

    HENKILOMATRIKKELIKIELTO(t) {
    }

    YHTEYSTIETOJEN_LUOVUTUSKIELTO(t) {
    }

    ASIAKASREKISTERIN_PAIVITYSKIELTO(t) {
    }

    TURVAKIELTO(t) {
        this.setData('protected_identity', t.turvakieltoAktiivinen);
    }

    VANHEMPI(t) {
    }

    VANHEMPI_SUPPEA(t) {
        this.setData('parents', t.vanhempi.henkilotunnus, true);
    }

    HUOLLETTAVA(t) { // barn under vårdnad
    }

    HUOLLETTAVA_SUPPEA(t) { // barn under vårdnad, begränsad
        this.setData('guarding_over', t.huollettava.henkilotunnus, true);
    }

    HUOLTAJA(t) {
    }

    HUOLTAJA_SUPPEA(t) {
        this.setData('custodian', t.huoltaja.henkilotunnus, true);
    }

    EDUNVALVONTAVALTUUTUS(t) { // intressebevakningsfullmarkt
        t.nykyisetEdunvalvontavaltuutetut.forEach(guardian => {
            this.setData('power_of_attorney', {
                ssn: guardian.edunvalvontavaltuutettu.henkilotunnus,
                start: renderDate(guardian.valtuutussuhteenAlkupv),
                end: renderDate(guardian.valtuutussuhteenLoppupv)
            }, true);
        });
    }

    /* language of communication */
    ASIONTIKIELI(t) {
        this.setData('language', t.kielikoodi);
    }

    KOTIMAINEN_YHTEYSOSOITE(t) { // kontaktadress i hemlandet. Personen med spärrmarkering har angett denna kontaktadress
        // TODO: check what this field contains
        // inrikes postadress, prio 1, men bara för dem som har security ban.
    }

    KUOLLEEKSIJULISTAMISPAIVA(t) { // datum för dödförklaring
        // TODO: check what this field contains
    }

    LAPSEN_SUKUPUOLI_JA_KANSALAISUUS(t) {
        // TODO: check what this field contains
    }

    SAHKOINEN_ASIOINTITUNNUS(t) { // elektronisk kommunikationskod
        // TODO: check what this field contains
    }

    TILAPAINEN_ULKOMAILLA_ASUMINEN(t) {
        // TODO: check what this field contains
    }

    TILAPAINEN_ULKOMAINEN_OSOITE(t) {
        // TODO: check what this field contains
    }

    ULKOMAINEN_YHTEYSOSOITE(t) {
        // TODO: check what this field contains
        // utländsk kontaktadress för de som har security ban
    }

    ULKOMAINEN_POSTIOSOITE(t) {
        // TODO: check what this field contains
        // utländsk postadress, fast.
    }
}
