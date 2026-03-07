import java.sql.*;
public class TestConn {
    public static void main(String[] args) {
        try {
            Class.forName("org.postgresql.Driver");
            System.out.println("Connecting without SSL...");
            Connection conn = DriverManager.getConnection(
                "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?prepareThreshold=0&sslmode=disable&socketTimeout=15&connectTimeout=15",
                "postgres.vamsopusaxzfbtrlhscx",
                "Thilina@7946"
            );
            System.out.println("Connected successfully!");
            conn.close();
        } catch (Exception e) {
            System.out.println("Failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
