import React, {useEffect, useState} from 'react';
import {View, Text, Image, Modal, StyleSheet, ScrollView} from 'react-native';
import {Button, Checkbox} from 'react-native-paper';
import {useRoute, useNavigation} from '@react-navigation/native';

const OrgVendorDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {vendor} = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [rejectedReasons, setRejectedReasons] = useState([]);

  const rejectionReasons = [
    'Incomplete Profile',
    'Invalid CNIC',
    'Fake Information',
    'Poor Ratings',
    'Other',
  ];

  useEffect(() => {
    if (vendor.approval_status === 'rejected') {
      fetchRejectedReasons();
    }
  }, []);

  const fetchRejectedReasons = async () => {
    try {
      const response = await fetch(
        `${url}/rejection-reasons/${vendor.organization_id}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Error fetching rejection reasons:', errorData.message);
        return;
      }
      const data = await response.json();
      setRejectedReasons(data.rejection_reasons);
    } catch (error) {
      console.error('Network error fetching rejection reasons:', error);
    }
  };

  const toggleReason = reason => {
    setSelectedReasons(prev =>
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason],
    );
  };

  const handleAccept = async () => {
    try {
      const response = await fetch(
        `${url}/accept-vendor-request/${vendor.request_id}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
        },
      );
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error approving vendor:', error);
    }
  };

  const handleReject = async () => {
    if (selectedReasons.length === 0) {
      alert('Please select at least one reason for rejection.');
      return;
    }

    try {
      const response = await fetch(
        `${url}/reject-vendor-request/${vendor.request_id}`,
        {
          method: 'POST',
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

  const handleCorrection = async reasonId => {
    const updated = rejectedReasons.filter(r => r.id !== reasonId);
    setRejectedReasons(updated);
    try {
      const response = await fetch(
        `${url}/correct-rejection-reason/${reasonId}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({rejection_reason_id: reasonId}),
        },
      );
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Vendor Profile */}
     
      <Text style={styles.name}>{vendor.vendor_name}</Text>
      <Text style={styles.detail}>📧 {vendor.vendor_email}</Text>
      <Text style={styles.detail}>📞 {vendor.vendor_phone}</Text>
      <Text style={styles.detail}>🆔 CNIC: {vendor.cnic}</Text>
      <Text style={styles.detail}>🔍 Status: {vendor.approval_status}</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleAccept} style={styles.acceptButton}>
          Accept Vendor
        </Button>
        <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.rejectButton}>
          Reject Vendor
        </Button>
      </View>

      {/* Rejection Reasons */}
      {vendor.approval_status === 'rejected' && rejectedReasons.length > 0 && (
        <View style={styles.rejectedContainer}>
          <Text style={styles.rejectedTitle}>🚫 Rejection Reasons:</Text>
          {rejectedReasons.map((reason, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.reasonText}>{reason.reason}</Text>
                <Text style={styles.statusText}>Status: {reason.status}</Text>
              </View>
              {reason.status !== 'Corrected' && (
                <Button mode="contained" onPress={() => handleCorrection(reason.id)} style={styles.correctButton}>
                  Correct
                </Button>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Rejection Reasons</Text>
            <ScrollView style={{maxHeight: 200}}>
              {rejectionReasons.map((reason, index) => (
                <Checkbox.Item
                  key={index}
                  label={reason}
                  status={selectedReasons.includes(reason) ? 'checked' : 'unchecked'}
                  onPress={() => toggleReason(reason)}
                />
              ))}
            </ScrollView>
            <Button mode="contained" onPress={handleReject} style={styles.rejectConfirmButton}>
              Confirm Reject
            </Button>
            <Button mode="text" onPress={() => setModalVisible(false)}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default OrgVendorDetails;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  acceptButton: {
    backgroundColor: '#388e3c',
  },
  rejectButton: {
    backgroundColor: '#d32f2f',
  },
  rejectedContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff8e1',
    borderRadius: 6,
    width: '100%',
  },
  rejectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  reasonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 12,
    color: '#888',
  },
  correctButton: {
    backgroundColor: '#43a047',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rejectConfirmButton: {
    backgroundColor: '#d32f2f',
    marginTop: 10,
  },
});
