package classandobjectprograms;

public class ClassandObjectExample3 {

    int bookId;
    String bookName;
    double price;

    // Default constructor
    ClassandObjectExample3() {
        bookId = 1;
        bookName = "Unknown";
        price = 0.0;
    }

    // Parameterized constructor
    ClassandObjectExample3(int id, String name, double cost) {
        bookId = id;
        bookName = name;
        price = cost;
    }

    void display() {
        System.out.println("Book ID: " + bookId + ", Name: " + bookName + ", Price: " + price);
    }

    public static void main(String[] args) {
        // Using default constructor
        ClassandObjectExample3 b1 = new ClassandObjectExample3();

        // Using parameterized constructor
        ClassandObjectExample3 b2 = new ClassandObjectExample3(101, "Java Programming", 499.99);

        // Displaying book details
        b1.display();
        b2.display();
    }
}

