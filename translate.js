/* toPigLatin(englishWord) takes in a string consisting of only letters, and returns
a string with its corresponding pig latin translation */
function toPigLatin(englishWord) {
    /* declare regular expression objects for 
    - all vowels (upper and lower case)
    - all uppercase letters
    - all lowercase letters
    */
   const vowelRegex = /[aeiouAEIOU]/;
   const uppercaseRegex = /[A-Z]/;
   const lowercaseRegex = /[a-z]/;
   //pigLatinWord will be returned
   let pigLatinWord = '';

    /* Pig Latin rule: if a word starts with a vowel or consists of only one letter,
    add "way" to the end of the word */
   if (vowelRegex.test(englishWord.substring(0, 1)) || englishWord.length === 1) {
       pigLatinWord = englishWord + 'way';
   }
   /* Pig Latin rule: if a word starts with a consonant but is followed by a vowel, 
   move the consonant to the end of the word and add on "ay" */
   else if (vowelRegex.test(englishWord.substring(1, 2))) {
       pigLatinWord = englishWord.substring(1) + englishWord.substring(0, 1) + 'ay';
   }
   /* Pig Latin rule: if a word starts with 2 consonants, move the consonants to the
   end of the word and add on "ay" */
   else {
       pigLatinWord = englishWord.substring(2) + englishWord.substring(0, 2) + 'ay';
   }

   //lowercase the entire pigLatinWord
   pigLatinWord = pigLatinWord.toLowerCase();
   //maintain any capitalization in the original english word
   // if no lowercase letters are found in englishWord and englishWord is not a single letter
   if (!lowercaseRegex.test(englishWord) && englishWord.length > 1) {
       return pigLatinWord.toUpperCase();
   }
   //if the first letter is capitalized
   else if (uppercaseRegex.test(englishWord.substring(0, 1))) {
       return pigLatinWord.substring(0, 1).toUpperCase() + pigLatinWord.substring(1);
   }
   //no capitalization
   else {
    return pigLatinWord;
   }
}



/* regexIndexOf(string, regex, pos) acts like an indexOf() function but with a regex as a
parameter. Returns the position of the first match of regex after pos, or -1 if not found. 
*/
function regexIndexOf(string, regex, pos) {
    if (string.substring(pos).search(regex) < 0) {
        return -1;
    }
    else {
        return string.substring(pos).search(regex) + pos;
    }
}



/* parsePigLatin(phrase) takes in a string of characters (may contain letters, numbers, symbols,
    or a mix of all of them) and returns the phrase with only the letter sequences translated 
    into Pig Latin. Nonletters cannot be translated into Pig Latin. They will remain unchanged
    and in their previous positions relative to the letter sequences.
*/ 
function parsePigLatin(phrase) {
    //initialize regexes for all letters, and for all nonletters
    const letterRegex = /[a-zA-Z]/;
    const nonletterRegex = /[^a-zA-Z]/;
    //make a copy of phrase and use it to initialize pigLatinPhrase, which will later be returned
    let pigLatinPhrase = phrase;

    // will only execute of there are ANY letters present in phrase, if there are not, 
    // phrase is returned without any changes
    if (letterRegex.test(phrase)) {
        //initialize startPos to the first occurence of a letter in phrase
        let startPos = phrase.search(letterRegex);
        //initialize endPos to phrase.length
        let endPos = phrase.length;

        //keeps iterating while there are still nonletters present after startPos
        while (regexIndexOf(phrase, nonletterRegex, startPos) >= 0) {
            endPos = regexIndexOf(phrase, nonletterRegex, startPos);
            //creating a letter sequence with startPos (next occurence of letter) and endPos (next occurence of nonletter)
            let english = phrase.substring(startPos, endPos);
            let pigLatin = toPigLatin(english);
            //original english substring is then replaced with the translated substring in pigLatinPhrase,
            //which was initialized to be identical to phrase previously. Phrase remains unchanged
            pigLatinPhrase = pigLatinPhrase.replace(english, pigLatin);
            //update startPos to be at the first occurence of a letter after the previous endPos, 
            //otherwise if it does not exist, break out of the loop. No more letter sequences need to be found
            if (regexIndexOf(phrase, letterRegex, endPos) >= 0) {
                startPos = regexIndexOf(phrase, letterRegex, endPos);
            }
            else {
                break;
            }
        }
        //deals with the case of startPos being updated, but not endPos. The loop exited because
        //the conditional evaluated to false. This means that phrase must end with a letter, 
        //and one last letter sequence must be sent to toPigLatin()
        if (letterRegex.test(phrase.substring(phrase.length - 1))) {
            let english = phrase.substring(startPos, phrase.length);
            let pigLatin = toPigLatin(english);
            pigLatinPhrase = pigLatinPhrase.replace(english, pigLatin);
        }
    }
    return pigLatinPhrase;

}


/* translateToPigLatin() extracts the user input from index.HTML and breaks it up into character substrings 
separated with spaces. The translated pigLatin output then updates the inner HTML of the ouput
field in index.HTML
*/
function translateToPigLatin() {
    //get input from index.HTML and trim it to get rid of unnecessary whitespace
    // initialize an empty string for output
    let input = document.getElementById('textInput').value.trim();
    let output = '';
    
    while (input.indexOf(' ', 0) >= 0) {
        //substring will always represent a sequence of characters without spaces
        let substring = input.substring(0, input.indexOf(' ', 0));
        //input is updated so that the value of substring is sliced off from the beginning
        input = input.substring(input.indexOf(' ', 0)).trim();
        //updating output with the return value from calling parsePigLatin()
        output += parsePigLatin(substring) + ' ';
    }
    //at this point, no more whitespaces can be found. input is reduced to a single 
    //character sequence without any spaces. This final character sequence is parsed
    //and added to output
    output += parsePigLatin(input);
    //updating the inner HTML of the webpage
    document.getElementById('pigLatinOutput').innerHTML = output;
}