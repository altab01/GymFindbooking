#include <vector>
#include <cmath>
#include <numeric>
#include <algorithm>
#include <iostream>

using namespace std;

long long computeMinDeliveryTime(vector<int> requestedHubs, vector<int> transitionTime) {
    int m = transitionTime.size();
    
    // pref[i] will store the clockwise distance from Hub 1 to Hub i+1
    // Using 0-indexed prefix array for convenience where pref[i] is distance to hub (i+1)
    vector<long long> pref(m + 1, 0);
    for (int i = 0; i < m; ++i) {
        pref[i + 1] = pref[i] + transitionTime[i];
    }
    
    long long total_ring_weight = pref[m];
    long long total_time = 0;
    
    // The drone starts its journey at Hub 1
    int current_hub = 1;
    
    for (int next_hub : requestedHubs) {
        if (current_hub == next_hub) {
            continue; // Already at the hub, takes 0 seconds
        }
        
        // Convert to 0-based indices for prefix sum calculations
        int u = min(current_hub, next_hub) - 1;
        int v = max(current_hub, next_hub) - 1;
        
        // Clockwise distance between the two points on the ring segment
        long long clockwise_dist = pref[v] - pref[u];
        
        // Counterclockwise distance is the alternative remaining part of the circle
        long long counterclockwise_dist = total_ring_weight - clockwise_dist;
        
        // Take the minimum of both paths
        total_time += min(clockwise_dist, counterclockwise_dist);
        
        // Move the drone to the new hub
        current_hub = next_hub;
    }
    
    return total_time;
}

int main() {
    // Sample Case 0 Validation
    // m = 3, n = 4
    // transitionTime = [3, 2, 1]
    // requestedHubs = [1, 3, 3, 2]
    cout << "Sample Case 0 Output: " << computeMinDeliveryTime({1, 3, 3, 2}, {3, 2, 1}) << " (Expected: 4)" << endl;

    // Sample Case 1 Validation
    // m = 2, n = 3
    // transitionTime = [1, 2]
    // requestedHubs = [1, 2, 1]
    cout << "Sample Case 1 Output: " << computeMinDeliveryTime({1, 2, 1}, {1, 2}) << " (Expected: 3)" << endl;

    return 0;
}