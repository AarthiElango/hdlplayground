module decoder_3to8_tb();

  reg A0, A1, A2, EN;
 wire  [7:0] D;
  reg [7:0] expected;
  integer error_count = 0;

  decoder_3to8 uut(.A0(A0), .A1(A1), .A2(A2), .EN(EN), .D(D));

  task check_output;
    input [2:0] A;
    input EN_i;
    begin
      A2 = A[2]; A1 = A[1]; A0 = A[0]; EN = EN_i; #5;
      if (!EN)
        expected = 8'b00000000;
      else
        expected = 8'b00000001 << A;
        
      if (D !== expected) begin
        $display("❌ ERROR at time %0t: A2A1A0=%b EN=%b | Expected=%b Got=%b", 
                 $time, {A2,A1,A0}, EN, expected, D);
        error_count++;
      end else begin
        $display("✅ PASS at time %0t: A2A1A0=%b EN=%b | Output=%b",
                 $time, {A2,A1,A0}, EN, D);
      end
    end
  endtask

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars();
    $display("\n===== DIRECT TEST CASES =====");
    for (integer en = 0; en < 2; en++) begin
      for (integer a = 0; a < 8; a++) begin
        check_output(a[2:0], en);
      end
    end

    $display("\n===== RANDOM TEST CASES =====");
    repeat (10) begin
      check_output($urandom_range(0,7), $urandom_range(0,1));
    end

    if (error_count == 0)
      $display("\n✅ All tests PASSED successfully!");
    else
      $display("\n❌ %0d test(s) FAILED!", error_count);

    $finish;
  end

endmodule