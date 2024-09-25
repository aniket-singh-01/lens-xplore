import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { db } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import { Button, Loading, Table } from "@geist-ui/core";
import { Grid } from "@geist-ui/core";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { Image } from "@geist-ui/core";
import { Modal } from "@geist-ui/core";
import { useContext } from "react";

const ProfilePage = () => {
  const [userData, setUserData] = React.useState(null);
  const { currentUser } = useContext(AuthContext);
  const [modal, setModal] = React.useState({
    open: false,
    data: null,
  });

  const fetchData = async () => {
    try {
      const response = await getDoc(doc(db, "users", currentUser.uid));
      setUserData(response.data());
      console.log(response.data());
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return userData == null ? (
    <div className="min-h-[calc(100vh-7rem)] flex justify-center items-center">
      <Loading>Hol up! Wait a minute!</Loading>
    </div>
  ) : (
    <div>
      <div className="min-h-[calc(100vh-7rem)] flex flex-col items-start">
        <div className="flex flex-col items-start justify-start">
          <h1 className="text-4xl text-center">Hello, {userData.name}!</h1>
          <p className="text-center">@{userData.username}</p>
        </div>

        <Grid.Container
          gap={2}
          justify="center"
          w="100%"
        >
          {userData.previous_uploads.map((post, index) => (
            <Grid
              key={index}
              sm={24}
              md={12}
              lg={6}
            >
              <Card className="w-full h-[75%] gap-4 justify-between items-center">
                <Image
                  loading="lazy"
                  width={"100%"}
                  height={"auto"}
                  className="object-cover aspect-square"
                  src={post.sharp}
                />
                <CardBody className="w-full flex justify-start items-start h-full">
                  <h3>{post.output.vendor}</h3>
                </CardBody>
                <CardFooter className="flex w-full justify-center items-center">
                  <Button
                    onClick={() => {
                      setModal({
                        open: true,
                        data: post,
                      });
                    }}
                  >
                    View this bill
                  </Button>
                </CardFooter>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
      </div>
      {modal.data != null && (
        <Modal
          w={"90%"}
          visible={modal.open}
          onClose={() => {
            setModal({
              open: false,
              data: null,
            });
          }}
        >
          <Table
            data={modal.data.output.items.map((item) => ({
              classification: modal.data.output.classification,
              vendor: modal.data.output.vendor,
              bill_number: modal.data.output.bill_number,
              bill_date: modal.data.output.bill_date,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              taxes: item.taxes.map((tax) => (
                <>
                  {tax.name}: {tax.rate} ({tax.percentage}) - ₹{tax.amount}
                  <br />
                </>
              )),
              grand_total: modal.data.output.grand_total,
            }))}
          >
            <Table.Column
              prop="classification"
              label="Classification"
            />
            <Table.Column
              prop="vendor"
              label="Vendor"
            />
            <Table.Column
              prop="bill_number"
              label="Bill Number"
            />
            <Table.Column
              prop="bill_date"
              label="Bill Date"
            />
            <Table.Column
              prop="name"
              label="Item Name"
            />
            <Table.Column
              prop="quantity"
              label="Quantity"
            />
            <Table.Column
              prop="price"
              label="Price"
            />
            <Table.Column
              prop="taxes"
              label="Taxes"
            />
            <Table.Column
              prop="grand_total"
              label="Grand Total"
            />
          </Table>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;
