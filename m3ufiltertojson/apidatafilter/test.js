function findMostCommonSequence(names, minPercentage) {
    const subsequenceCounts = {}; // Object to store subsequences and their counts
    const totalNames = names.length; // Total number of names

    //console.log(`Total names: ${totalNames}`);

    // Generate all subsequences for each name
    for (const name of names) {
        const normalizedName = normalizeName(name); // Normalize each name
        const subsequences = generateSubsequences(normalizedName); // Get subsequences

        //console.log(`Normalized name: "${normalizedName}" -> Subsequences:`, subsequences);

        // Count occurrences of each subsequence
        for (const subsequence of subsequences) {
            if (!subsequenceCounts[subsequence]) {
                subsequenceCounts[subsequence] = new Set(); // Initialize set for unique names
            }
            subsequenceCounts[subsequence].add(normalizedName); // Add name to the set
        }
    }

    // Convert subsequence counts to an array and sort by frequency
    const sortedSubsequences = Object.entries(subsequenceCounts).sort(
        (a, b) => b[1].size - a[1].size // Sort by frequency of subsequences (size of set)
    );

    // Prepare results: subsequence, its count, and percentage of appearance
    const mostCommonSubsequences = sortedSubsequences.map(([subsequence, namesSet]) => {
        const percentage = ((namesSet.size / totalNames) * 100).toFixed(2); // Percentage of names containing the subsequence
        return { subsequence, count: namesSet.size, percentage: `${percentage}%`, length: subsequence.length }; // Add subsequence length
    });

    // Filter results based on the minimum percentage threshold (minPercentage)
    const filteredResults = mostCommonSubsequences.filter(subseq => parseFloat(subseq.percentage) >= minPercentage);

    // Sort the filtered results by the length of the subsequence (longest first) and then by count
    const sortedByLength = filteredResults.sort((a, b) => b.length - a.length || b.count - a.count);

    // Debug: Log the filtered and sorted subsequences
   // console.log(`Filtered and sorted subsequences (min percentage: ${minPercentage}%):`, sortedByLength);
   let notallow=["","TV","FRANCE 2"]
   
    function isDigit(str) {
        return /^\d+$/.test(str);
    }
   let good= (sortedByLength)=>{
        let pointer=0; let g; let isnotok
         do {g= sortedByLength[pointer]?.subsequence
            isnotok=(isDigit(sortedByLength[pointer]?.subsequence)||notallow.includes(sortedByLength[pointer]?.subsequence))
         if (isnotok) pointer++
       // console.log(g,"",pointer,"",sortedByLength,"",isnotok)
        }
        while(isnotok);
    return g;}
    return good(sortedByLength)
}

// Helper function to normalize names (convert to lowercase and remove extra spaces)
function normalizeName(name) {
    return name.trim();
}

// Helper function to generate all subsequences of a name
function generateSubsequences(name) {
    const words = name.split(/\s+/); // Split the name into words
    const subsequences = new Set();

    // Generate all possible subsequences
    for (let i = 0; i < words.length; i++) {
        let subsequence = '';
        for (let j = i; j < words.length; j++) {
            subsequence += (subsequence ? ' ' : '') + words[j];
            subsequences.add(subsequence); // Add subsequence to set
        }
    }

    return [...subsequences]; // Return unique subsequences
}

// Test case
const names=[
    'FRANCE 2', 'FRANCE 2',
    'FRANCE 2', 'FRANCE 2',
    'FRANCE 2', 'FRANCE 2',
    'FRANCE 2', 'FRANCE 2',
    'FRANCE 2', 'FRANCE 2',
    'FRANCE 2', 'C+ RÉU  FRANCE 2',
    'FRANCE 2', 'FRANCE 2',
    'FRANCE 3', 'C+ CAR  FRANCE 3'
  ]

// Minimum percentage threshold
const minPercentage = 10;

// Find and sort the subsequences
const result = findMostCommonSequence(names, minPercentage);
console.log(result);
