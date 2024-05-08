// This is a temp fix for the missing jsonwebtoken module.
// The imported types do not correctly align for some reason, so we're just gonna treat it like normal js for now.
// This is a hack "for now" lol. its gonna be here for a decade.
declare module 'jsonwebtoken';
