import React, {useEffect, useState} from 'react';
import {View, Text, Image, Modal, StyleSheet} from 'react-native';
import {Button, Checkbox} from 'react-native-paper';
import {useRoute, useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';

const BranchDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {vendor} = route.params; // Get vendor details from navigation params

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [rejectedReasons, setRejectedReasons] = useState([]); // Store reasons if vendor is rejected

  const rejectionReasons = [
    'Incomplete Branch info',
    'Invalid phone no',
    'Fake Information',
    'Poor Ratings',
    'Other',
  ];
  useEffect(() => {
    if (vendor.branch_approval_status === 'rejected') {
      fetchRejectedReasons();
    }
  }, []);
  const fetchRejectedReasons = async () => {
    try {
      const response = await fetch(
        `${url}/admin/branches/${vendor.branch_id}/rejection-reasons`,
      );
      
      if (!response.ok) {
       
        const errorData = await response.json();
        console.warn('Error fetching rejection reasons:', errorData.message);
        return;
      }

      const data = await response.json();
      setRejectedReasons(data);
      console.log(data) 
    } catch (error) {
      console.error('Network error fetching rejection reasons:', error);
    }
  };
 
  const toggleReason = reason => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  // Accept vendor API call
  const handleAccept = async () => {
    try {
      const response = await fetch(
        `${url}/admin/branches/${vendor.branch_id}/approve`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
        },
      );
      const data = await response.json();
      alert(data.message);
      navigation.goBack();
    } catch (error) {
      console.error('Error approving Branch:', error);
    }
  };

  
  const handleReject = async () => {
    if (selectedReasons.length === 0) {
      alert('Please select at least one reason for rejection.');
      return;
    }

    try {
      const response = await fetch(
        `${url}/admin/branches/${vendor.branch_id}/reject`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({rejection_reasons: selectedReasons}),
        },
      );
      const data = await response.json();
      alert(data.message);
      setModalVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting vendor:', error);
    }
  };
  const handleCorrection = async e => {
    const newrejectionreason=rejectedReasons.filter(r=> r.id!=e)
    setRejectedReasons(newrejectionreason)
    try {
      const response = await fetch(
        `${url}/admin/branches/${vendor.branch_id}/correct-rejection-reason`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({rejection_reason_id: e}),
        },
      );
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  return (
    <View style={styles.container}>
      {/* Vendor Profile */}
      <Image source={{uri: vendor.branch_picture}} style={styles.image} />
      <Text style={styles.name}>{vendor.shop_name}</Text>
      <Text style={styles.detail}>Area: {vendor.area}</Text>
      <Text style={styles.detail}>City: {vendor.city}</Text>

      <Text style={styles.detail}>Catagory: {vendor.shop_category}</Text>
      <Text style={styles.detail}>🏬 Type: {vendor.vendor_type}</Text>
      <Text style={styles.detail}>🔍 Status: {vendor.branch_approval_status}</Text>

      {/* Accept & Reject Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleAccept}
          style={styles.acceptButton}>
          Accept Branch
        </Button>
        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.rejectButton}>
          Reject Branch
        </Button>
      </View>

      {/* Show rejection reasons if vendor is rejected */}
      {vendor.branch_approval_status === 'rejected' && rejectedReasons.length > 0 && (
        <View style={styles.rejectedContainer}>
          <Text style={styles.rejectedTitle}>🚫 Rejected Reasons:</Text>

          {rejectedReasons.map((reason, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.reasonText}>{reason.reason}</Text>
                <Text style={{}}>Status:{reason.status}</Text>
              </View>
              {reason.status !== "Corrected" && (
          <Button
            mode="contained"
            onPress={() => handleCorrection(reason.id)}
            style={styles.correctButton}>
            Correct Issue
          </Button>
        )}
            </View>
          ))}
        </View>
      )}

      {/* Reject Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Rejection Reasons</Text>

            {rejectionReasons.map((reason, index) => (
              <Checkbox.Item
                key={index}
                label={reason}
                status={
                  selectedReasons.includes(reason) ? 'checked' : 'unchecked'
                }
                onPress={() => toggleReason(reason)}
              />
            ))}

            <Button
              mode="contained"
              onPress={handleReject}
              style={styles.rejectConfirmButton}>
              Confirm Reject
            </Button>
            <Button mode="text" onPress={() => setModalVisible(false)}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BranchDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: 'gray',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: 'green',
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rejectConfirmButton: {
    marginTop: 10,
    backgroundColor: 'red',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background for better visibility
  },
  rejectedContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
  },
  rejectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  correctButton: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
