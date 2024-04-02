import { StyleSheet, Text, View, Image , Button} from 'react-native';
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FECC4C',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bigText: {
      fontSize: 40,
      textAlign: "center",
      color: 'black',
    },
    mainCircleImage: {
      height: 80,
      width: 80,
      borderRadius: 40,
    },
    backgroundHome: {
      backgroundColor: 'F5F5F5',
    },
    searchbarHome: {
      width: 80,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      header: {
        marginTop: 70, 
      },
      headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      searchSection: {
        margin: 10,
      },
      searchInput: {
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        padding: 15,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 10,
      },
      destinations: {
        margin: 10,
      },
      destinationsList: {
        alignSelf: 'stretch', 
      },
      destinationItem: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      destinationIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      destinationImage: {
        width: 50, 
        height: 50, 
        resizeMode: 'contain',
      },
      destinationItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        padding: 20,
        marginBottom: 10,
      },
      destinationIconContainer: {
        // Style for the icon container
      },
      destinationText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      destinationTime: {
        fontSize: 14,
      },
      goButton: {
        position: 'absolute',
        bottom: 50, 
        alignSelf: 'center',
        backgroundColor: '#ffcc00',
        borderRadius: 30,
        padding: 20,
      },
      goButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      bottomMenu: {
        
      },
  });