$(document).ready(function() {
	$active = "";
	var answer_set = [];

	$('td').click( function() {
		$('td').css('background', '#fff');
		$(this).css('background', '#aaa');
		$active = $(this).children('div');
	});

	$("#go").click( function() {
		solveit();
	});
	
	$("#reset").click( function() {
		$("#sudoku_table>tbody>tr>td>div").text("");
	});
  
	$('body').keypress(function (event) {
		if ($active == "")
			$active = $("#sudoku_table>tbody>tr:first>td:first").children("div");

		if (event.which >= 48 && event.which <= 57)
				$active.text(String.fromCharCode(event.which));
			else
				$active.text("");

		$active.parent('td').css('background', '#fff');
		if ($active.parent('td').next('td').length > 0)
		{
			$active.parent('td').next('td').css('background','#aaa');
			$active = $active.parent('td').next('td').children('div');
		}
		else
		{
			$active.parent('td').parent('tr').next('tr').children('td:first').css('background','#aaa');
			$active = $active.parent('td').parent('tr').next('tr').children('td:first').children('div');
		}
	});
    
	var sudoku = [];
	var helper = [];

	function solveit()
	{
		var started = 0;
		if ($active != "")
			$active.parent('td').css('background', '#fff');
	
		for(var i = 0; i <= 11 ; i++)
		{
			sudoku[i] = [];
			helper[i] = [];
			for(var j = 0; j <= 11 ; j++)
			{
				$current_value = $("#cel"+i.toString()+"-"+j.toString()).text();
				var element = {
					type: "Z"
				}
				if ($current_value.length > 0)
				{
					sudoku[i][j] = parseInt($current_value);
					$("#cel"+i.toString()+"-"+j.toString()).parent('td').css('background', '#EEEEEE');
					element.type = "I";
					started++;
				} 
				else
				{
					sudoku[i][j] = "-";
					element.type = "Z";
				}
				helper[i][j] = element;
			}
		}
		
		if (!InputValidation())
		{
		
			alert("Fouten in opgave");
		}
		else
		{
			var start = new Date();
			var overallnos = 0;
			var prev_overalnos = 0;
			do
			{
				prev_overalnos = overallnos;
				do
				{
					var nos = 0;
					for(var i = 0; i <= 11 ; i++)
					{
						for(var j = 0; j <= 11 ; j++)
						{
							if (helper[i][j].type == "Z")
							{
								if (SolveThisOne(i, j) == true)
								{
									helper[i][j].type = "X";
									nos++;
								}
							}
						}
					}
					overallnos += nos;
				} while (nos > 0)
				// Try row by row
				overallnos += RowHandler();	
				// Try column by column
				overallnos += ColumnHandler();
			} while (overallnos > prev_overalnos);
			var end = new Date();
			alert(end-start);
			alert(overallnos+started);
			
		}
	}
	
	//
	function RowHandler() {
		var oplossingen = 0;
		for (var i = 0; i <= 11; i++)
		{
			var possible_answers = GenerateAnswerSet("R",i);
			if (possible_answers.length > 0)
			{
				possible_answers = KillWrongAnswers("R", possible_answers, i);
				if (possible_answers.length == 1)
				{
					// We kunnen de rij met zekerheid vervolledigen.
					invullen = 0;
					for (y = 0; y <= 11; y++)
					{
						if (sudoku[i][y] == "-")
						{
							sudoku[i][y] = possible_answers[0][invullen];
							helper[i][y].type = "X";
							$("#cel"+i.toString()+"-"+y.toString()).text(sudoku[i][y]);
							$("#cel"+i.toString()+"-"+y.toString()).parent("td").css('background','#AAA');
							oplossingen++;
							invullen++;
						}
					}
				}
				else
				{
					// We kunnen de rij NIET met zekerheid vervolledigen maar misschien enkele cellen?
					var mvalid = 0;
					for (var q = 0; q < possible_answers[0].length; q++)
					{
						var ref = possible_answers[0][q];
						var valid = true;
						for (var r = 0; r < possible_answers.length; r++)
						{
							if (possible_answers[r][q] != ref) valid = false;
						}
						if (valid)
						{
							
							var hulpke = 0;
							var y = 0;
							while (hulpke <= q - mvalid)
							{
								if (sudoku[i][y] == "-") hulpke++;
								y++;
							}
							y--;
							sudoku[i][y] = possible_answers[0][q];
							helper[i][y] = "X";
							$("#cel"+i.toString()+"-"+y.toString()).text(sudoku[i][y]);
							$("#cel"+i.toString()+"-"+y.toString()).parent("td").css('background','#AAA');
							mvalid++;
							oplossingen++;

						}
					}
				}
			}
		}	
		return oplossingen;
	}
	
	function ColumnHandler()
	{
		var oplossingen = 0;
		for (var i = 0; i <= 11; i++)
		{
			var possible_answers = GenerateAnswerSet("C",i);
			if (possible_answers.length > 0)
			{
				possible_answers = KillWrongAnswers("C", possible_answers, i);
					
				if (possible_answers.length == 1)
				{
					// We kunnen de kolom met zekerheid vervolledigen.
					invullen = 0;
					for (y = 0; y <= 11; y++)
					{
						if (sudoku[y][i] == "-")
						{
							
							sudoku[y][i] = possible_answers[0][invullen];
							helper[y][i].type = "X";
							$("#cel"+y.toString()+"-"+i.toString()).text(sudoku[y][i]);
							$("#cel"+y.toString()+"-"+i.toString()).parent("td").css('background','#AAA');
							oplossingen++;
							invullen++;
						}
					}
				}
				else
				{
					// We kunnen de kolom NIET met zekerheid vervolledigen maar misschien enkele cellen?
					var mvalid = 0;
					for (var q = 0; q < possible_answers[0].length; q++)
					{
						var ref = possible_answers[0][q];
						var valid = true;
						for (var r = 0; r < possible_answers.length; r++)
						{
							if (possible_answers[r][q] != ref) valid = false;
						}
						if (valid)
						{
							
							
							var hulpke = 0;
							var y = 0;
							while (hulpke <= q - mvalid)
							{
								if (sudoku[y][i] == "-") hulpke++;
								y++;
							}
							y--;
							sudoku[y][i] = possible_answers[0][q];
							helper[y][i].type = "X";
							$("#cel"+y.toString()+"-"+i.toString()).text(sudoku[y][i]);
							$("#cel"+y.toString()+"-"+i.toString()).parent("td").css('background','#AAA');
							mvalid++;
							oplossingen++;
						}
					}
				}
			}
		}	
		return oplossingen;
	}
      
	
	function GenerateAnswerSet(RowOrColumn, Index)
	{
		answer_set = [];
		var aantal_nul = 0;
		var aantal_een = 0;
		var possible_answers = [];
		var row = 0;
		var column = 0;
		
		if (RowOrColumn == "R")
		{
			for (var j = 0; j <= 11; j++)
			{
				if (sudoku[Index][j] == 0) aantal_nul++;
				if (sudoku[Index][j] == 1) aantal_een++;
			}
		}
		else
		{
			for (var j = 0; j <= 11; j++)
			{
				if (sudoku[j][Index] == 0) aantal_nul++;
				if (sudoku[j][Index] == 1) aantal_een++;
			}
		}
		
		for (var teller = aantal_nul; teller < 6; teller++)
			answer_set.push(0);
		for (var teller = aantal_een; teller < 6; teller++)
			answer_set.push(1);
		
		answer_set = answer_set.sort();
		select = answer_set.length;	
		possible_answers.push(answer_set.slice(0));

		while (get_next(select))
			possible_answers.push(answer_set.slice(0));
			
		return possible_answers;
	}
	
	function KillWrongAnswers(RowOrColumn, possible_answers, Index)
	{
		var wrong_answer = [];
		for (var x = 0; x < possible_answers.length; x++)
		{
			var temp_array = clone(sudoku);
			var invullen = 0;
			for (y = 0; y <= 11; y++)
			{
				if (RowOrColumn == "R")
				{
					if (temp_array[Index][y] == "-")
					{
						temp_array[Index][y] = possible_answers[x][invullen];
						invullen++;
					}
				}
				else
				{
					if (temp_array[y][Index] == "-")
					{
						temp_array[y][Index] = possible_answers[x][invullen];
						invullen++;
					}
				}
			}
			
			// Is this valid?
			var valid = true;
			if (RowOrColumn == "R")
				valid = RowValidator(temp_array, Index);
			else
				valid = ColumnValidator(temp_array, Index);
			
			if (valid == false)
				wrong_answer.push(x);
		}
		
		for (var m = wrong_answer.length - 1; m >= 0; m--)
			possible_answers.splice(wrong_answer[m],1);
		
		return possible_answers;

	}
	
	function RowValidator(temp_array, Index)
	{
		for (var y = 0; y <= 11; y++)
		{
			// Geen trio's in de rij??
			if ((y <= 9) && (temp_array[Index][y] == temp_array[Index][y+1]) && (temp_array[Index][y] == temp_array[Index][y+2]))
				return false;

			// Geen trio's in de kolom waarbij te controleren rij de bovenste is in het mogelijk trio
			if ((Index <= 9) && (temp_array[Index][y] == temp_array[Index+1][y]) && (temp_array[Index][y] == temp_array[Index+2][y]))
				return false;

			// Geen trio's in de kolom waarbij te controleren rij de middenste is in het mogelijk trio
			if ((Index <= 10 && Index >= 1) && (temp_array[Index-1][y] == temp_array[Index][y]) && (temp_array[Index][y] == temp_array[Index+1][y]))
				return false;

			// Geen trio's in de kolom waarbij te controleren rij de onderste is in het mogelijk trio
			if ((Index >= 2) && (temp_array[Index-2][y] == temp_array[Index][y]) && (temp_array[Index][y] == temp_array[Index-1][y]))
				return false;
				
/*			var one = 0;
			for (var z = 0; z <= 11; z++)
				if (temp_array[y][z]  "1") one++;

			if (one != 6) return false;*/
		}
		return true;
	}
	function display_array(arrayd)
	{
		var display = [];
		for(var i = 0; i <= 11 ; i++)
		{
			display[i] = arrayd[i].join(" - ");
		}
		alert(display.join("\n"));
	}
	
	function ColumnValidator(temp_array, Index)
	{
		for (var y = 0; y <= 11; y++)
		{
		// Geen trio's in de kolom??
			if ((y <= 9) && (temp_array[y][Index] == temp_array[y+1][Index]) && (temp_array[y][Index] == temp_array[y+2][Index]))
				return false;

			// Geen trio's in de rij waarbij te controleren kolom de meest linkse is in het mogelijk trio
			if ((Index <= 9) && (temp_array[y][Index] == temp_array[y][Index+1]) && (temp_array[y][Index] == temp_array[y][Index+2]))
				return false;

			// Geen trio's in de rij waarbij te controleren kolom de middenste is in het mogelijk trio
			if ((Index <= 10 && Index >= 1) && (temp_array[y][Index-1] == temp_array[y][Index]) && (temp_array[y][Index] == temp_array[y][Index+1]))
				return false;

			// Geen trio's in de rij waarbij te controleren kolom de meeste rechtse is in het mogelijk trio
			if ((Index >= 2) && (temp_array[y][Index-2] == temp_array[y][Index]) && (temp_array[y][Index] == temp_array[y][Index-1]))
				return false;
		
		/*	var one = 0;
			for (var z = 0; z <= 11; z++)
				if (temp_array[z][y] == 1) one++;

			if (one != 6) return false;*/

		
		}
		return true;
	}
	
	
	
	// Function for deep cloning an array of arrays :)
	function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
  
	// Currently not used
	function InputValidation()
	{
		return true;
	}
	
	function CheckDouble(x, y)
	{
		// Left
		if (y > 1)
		{
			if (sudoku[x][y-1]!= "-" && sudoku[x][y-1] == sudoku[x][y-2])
				return sudoku[x][y-1];
		}
		
		// Right
		if (y < 10)
		{
			if (sudoku[x][y+1]!= "-" && sudoku[x][y+1] == sudoku[x][y+2])
				return sudoku[x][y+1];
		}
		
		//Above
		if (x > 1)
		{
			if (sudoku[x-1][y]!= "-" && sudoku[x-1][y] == sudoku[x-2][y])
				return sudoku[x-1][y];
		}
		
		// Below
		if (x < 10)
		{
			if (sudoku[x+1][y]!= "-" && sudoku[x+1][y] == sudoku[x+2][y])
				return sudoku[x+1][y];
		}
		
		return "?";
	}
	
	function AvoidTrio(x, y)
	{
		//Horiz
		if (y > 0 && y < 11)
		{
			if (sudoku[x][y-1]!= "-" && sudoku[x][y-1] == sudoku[x][y+1])
				return sudoku[x][y-1];
		}
		
		//Vert
		if (x > 0 && x < 11)
		{
			if (sudoku[x+1][y]!= "-" && sudoku[x-1][y] == sudoku[x+1][y])
				return sudoku[x+1][y];
		}
		
		return "?";
	}
	
	function Counter(x, y)
	{
		var zerocolumn = 0;
		var zerorow = 0;
		var onecolumn = 0;
		var onerow = 0;
		for (var a = 0; a < 12; a++)
		{
			if (sudoku[x][a] == 0) zerorow++;
			if (sudoku[x][a] == 1) onerow++;
			if (sudoku[a][y] == 0) zerocolumn++;
			if (sudoku[a][y] == 1) onecolumn++;
		}
		
		if (zerorow == 6 || zerocolumn == 6) 
		{
		return 1;
		}
		if (onerow == 6 || onecolumn == 6) return 0;
		return "?";
			
	}

	function SolveThisOne(x, y)
	{
        $res = CheckDouble(x, y);
		if ($res != "?")
		{
			if ($res == 0)
				sudoku[x][y] = 1;
			else
				sudoku[x][y] = 0;
		}
		else
		{
			$res = AvoidTrio(x, y);
			if ($res != "?")
			{
			if ($res == 0)
					sudoku[x][y] = 1;
				else
					sudoku[x][y] = 0;
			}
			else
			{
				$res = Counter(x, y);

				if ($res != "?")
				{
					sudoku[x][y] = $res;
				}
				else
				{
					return false;
				}
			}
		}
		
		$("#cel"+x.toString()+"-"+y.toString()).text(sudoku[x][y]);
		$("#cel"+x.toString()+"-"+y.toString()).parent("td").css('background','#AAA');
		return true;
    }
      
function get_next( k )
{
    var i = k - 1;
    while (answer_set[i-1] >= answer_set[i]) i--;

    if (i < 1) return false;

    var j = k;
    while (answer_set[j-1] <= answer_set[i-1]) 
        j--;

    swap(i - 1, j - 1);

    i++; 
    j = k;

    while (i < j)
    {
        swap(i - 1, j - 1);
        i++;
        j--;
    }
    return true;
}

function swap( a, b )
{
    temp     = answer_set[a];
    answer_set[a] = answer_set[b];
    answer_set[b] = temp;
}

});