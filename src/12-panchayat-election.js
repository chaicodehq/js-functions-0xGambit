/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */

export function createElection(candidatesList) {
  // --- PRIVATE STATE (The Vault) ---
  const registeredVoters = new Set();
  const alreadyVoted = new Set();
  const voteTally = {}; // Map of candidateId -> count
  
  // Initialize tally for all candidates to 0
  candidatesList.forEach(c => { voteTally[c.id] = 0; });

  return {
    registerVoter(voter) {
      if (!voter || !voter.id || voter.age < 18) return false;
      if (registeredVoters.has(voter.id)) return false;

      registeredVoters.add(voter.id);
      return true;
    },

    castVote(voterId, candidateId, onSuccess, onError) {
      // 1. Validation (Gray Guard)
      if (!registeredVoters.has(voterId)) return onError("Not registered");
      if (alreadyVoted.has(voterId)) return onError("Already voted");
      if (!voteTally.hasOwnProperty(candidateId)) return onError("Invalid candidate");

      // 2. Record Vote
      alreadyVoted.add(voterId);
      voteTally[candidateId]++;

      // 3. Callback execution
      return onSuccess({ voterId, candidateId });
    },

    getResults(sortFn) {
      // Map the private tally back to a "light pink" results array
      const results = candidatesList.map(c => ({
        ...c,
        votes: voteTally[c.id]
      }));

      // If HOF provided, use it; else default to descending votes
      if (typeof sortFn === 'function') {
        return results.sort(sortFn);
      }
      return results.sort((a, b) => b.votes - a.votes);
    },

    getWinner() {
      const results = this.getResults();
      const totalVotes = Object.values(voteTally).reduce((a, b) => a + b, 0);
      
      return totalVotes === 0 ? null : results[0];
    }
  };
}

export function createVoteValidator(rules) {
  // FACTORY: Returns a specialized function pre-loaded with 'rules'
  return function(voter) {
    if (!voter) return { valid: false, reason: "No voter data" };

    // Check required fields using every()
    const fieldsMissing = rules.requiredFields.some(field => !(field in voter));
    if (fieldsMissing) return { valid: false, reason: "Missing fields" };

    if (voter.age < rules.minAge) return { valid: false, reason: "Underage" };

    return { valid: true, reason: "Approved" };
  };
}

export function countVotesInRegions(regionTree) {
  // RECURSION: The "Matryoshka" approach
  if (!regionTree) return 0;

  const currentVotes = regionTree.votes || 0;
  const subRegionVotes = (regionTree.subRegions || []).reduce((acc, sub) => {
    return acc + countVotesInRegions(sub);
  }, 0);

  return currentVotes + subRegionVotes;
}

export function tallyPure(currentTally, candidateId) {
  // PURE FUNCTION: Zero mutation
  const currentCount = currentTally[candidateId] || 0;
  
  return {
    ...currentTally,
    [candidateId]: currentCount + 1
  };
}